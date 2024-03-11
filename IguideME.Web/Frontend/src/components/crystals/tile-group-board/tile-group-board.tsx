import { useMemo, type FC, type ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensors,
  useSensor,
  PointerSensor,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import Loading from '@/components/particles/loading';
import { type Tile, type TileGroup } from '@/types/tile';
import EditTile from '@/components/crystals/edit-tile/edit-tile';
import AdminTileView from '@/components/crystals/admin-tile-view/admin-tile-view';
import AdminTileGroupView from '@/components/crystals/admin-tile-group/admin-tile-group';
import { getTileGroups, getTiles, patchTile, patchTileGroupOrder, patchTileOrder, postTileGroup } from '@/api/tiles';
import { DrawerContext } from './contexts';
import Swal from 'sweetalert2';

const TileGroupBoard: FC = (): ReactElement => {
  const { data: tilegroups, isFetching } = useQuery('tile-groups', getTileGroups);
  const { data: tiles } = useQuery('tiles', getTiles);
  const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [editTile, setEditTile] = useState<Tile | null>(null);
  const [move, setMove] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: postGroup } = useMutation({
    mutationFn: postTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tile-groups');
    },
  });

  const { mutate: updateTileGroupOrder } = useMutation({
    mutationFn: patchTileGroupOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tile-groups');
    },
  });

  const { mutate: updateTileOrder } = useMutation({
    mutationFn: patchTileOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tiles');
    },
  });

  const { mutate: updateTile } = useMutation({
    mutationFn: patchTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tiles');
    },
  });

  // Add 1 to the id's because dnd doesn't like 0 as an id.
  const groupIds = useMemo(
    () => (tilegroups === undefined ? [] : tilegroups.map((group) => group.id + 1)),
    [tilegroups],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
  );

  if (tilegroups === undefined || isFetching) {
    return <Loading />;
  }

  return (
    <DrawerContext.Provider value={{ editTile, setEditTile }}>
      <div className="tileGroupBoard">
        <Drawer
          title={'Editing: ' + editTile?.title}
          placement="right"
          closable
          width="45vw"
          onClose={() => {
            void Swal.fire({
              title: 'Warning: any unsaved changes will be deleted!',
              icon: 'warning',
              focusCancel: true,
              showCancelButton: true,
              confirmButtonText: 'Close',
              cancelButtonText: 'Cancel',
              customClass: {},
            }).then((result) => {
              if (result.isConfirmed) {
                setEditTile(null);
              }
            });
          }}
          open={editTile !== null}
          rootStyle={{ position: 'absolute' }}
          getContainer={() => {
            return document.getElementsByClassName('adminContent')[0];
          }}
        >
          {editTile === null ? '' : <EditTile tile={editTile} />}
        </Drawer>
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
          <div>
            <SortableContext items={groupIds}>
              {tilegroups.map((group, index) => (
                <div key={index}>
                  <AdminTileGroupView group={group} />
                </div>
              ))}
            </SortableContext>
            <Button
              type="dashed"
              onClick={() => {
                postGroup({ title: 'TileGroup', id: -1, position: tilegroups.length + 1 });
              }}
              block
              icon={<PlusOutlined />}
            >
              New Group
            </Button>
          </div>
          {createPortal(
            <DragOverlay>
              {activeGroup !== null && <AdminTileGroupView group={activeGroup} />}
              {activeTile !== null && <AdminTileView tile={activeTile} move={move} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </DrawerContext.Provider>
  );

  function onDragStart(event: DragStartEvent): void {
    switch (event.active.data.current?.type) {
      case 'Group':
        setActiveGroup(event.active.data.current.group);
        return;
      case 'Tile':
        setActiveTile(event.active.data.current.tile);
    }
  }

  function onDragOver(event: DragOverEvent): void {
    setMove(false);

    const { active, over } = event;
    if (over === null) return;

    const activeID = active.id;
    const overID = over.id;
    if (activeID === overID) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData === undefined) return;
    if (overData === undefined) return;
    if (activeData.type === 'Group') return;

    if (activeData.type === 'Tile') {
      if (overData.type === 'Group' && activeData.tile.group_id === +overID - 1) return;
      if (overData.type === 'Tile' && activeData.tile.group_id === overData.tile.group_id) return;
      setMove(true);
    }
  }

  function onDragEnd(event: DragEndEvent): void {
    setActiveGroup(null);
    setActiveTile(null);
    setMove(false);
    const { active, over } = event;
    if (over === null) return;

    const activeID = active.id;
    const overID = over.id;
    if (activeID === overID) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData === undefined) return;
    if (overData === undefined) return;

    // Handle dropping of tile groups and save new order.
    switch (activeData.type) {
      case 'Group':
        dropGroup(+activeID - 1, +overID - 1);
        return;
      case 'Tile':
        dropTile(activeID, overID, activeData, overData);
        return;
      default:
        console.log('Unknown active object type encountered during drop', activeData.type);
    }
  }

  function dropGroup(activeID: number, overID: number): void {
    if (tilegroups === undefined) return;

    const ids = tilegroups.map((group) => group.id);
    const activeIndex = ids.findIndex((id) => id === activeID);
    const overIndex = ids.findIndex((id) => id === overID);
    updateTileGroupOrder(arrayMove(ids, activeIndex, overIndex));
  }

  function dropTile(activeID: UniqueIdentifier, overID: UniqueIdentifier, activeData: any, overData: any): void {
    if (tiles === undefined) return;

    switch (overData.type) {
      case 'Group':
        activeData.tile.group_id !== +overID - 1 && moveTileToGroup(activeData.tile, +overID - 1);
        return;
      case 'Tile':
        activeData.tile.group_id === overData.tile.group_id
          ? swapTiles(+(activeID as string).substring(1) - 1, +(overID as string).substring(1) - 1, overData)
          : moveTileToGroup(activeData.tile, overData.tile.group_id);
        return;
      default:
        console.log('Unknown over object type encountered during drop', activeData.type);
    }
  }

  function swapTiles(activeID: number, overID: number, overData: any): void {
    const ids = tiles!.flatMap((tile) => (tile.group_id === overData.tile.group_id ? [tile.id] : []));
    const activeIndex = ids.findIndex((id) => id === activeID);
    const overIndex = ids.findIndex((id) => id === overID);
    updateTileOrder(arrayMove(ids, activeIndex, overIndex));
  }

  function moveTileToGroup(tile: Tile, gid: number): void {
    const gtiles = tiles!.filter((tile) => tile.group_id === gid);
    // Set the position of the tile to the last of the new group
    updateTile({
      ...tile,
      group_id: gid,
      position: (gtiles.length > 0 ? gtiles[gtiles.length - 1].position : 0) + 1,
    });
  }
};

export default TileGroupBoard;
