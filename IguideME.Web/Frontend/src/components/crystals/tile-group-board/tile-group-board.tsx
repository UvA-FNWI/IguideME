import { getTileGroups, getTiles, patchTile, patchTileGroupOrder, patchTileOrder, postTileGroup } from '@/api/tiles';
import AdminTileGroupView from '@/components/crystals/admin-tile-group/admin-tile-group';
import AdminTileView from '@/components/crystals/admin-tile-view/admin-tile-view';
import EditTile from '@/components/crystals/edit-tile/edit-tile';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { PlusOutlined } from '@ant-design/icons';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Row } from 'antd';
import { type FC, type ReactElement, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { useDrawerStore } from './useDrawerStore';

import { type Tile, type TileGroup } from '@/types/tile';

const TileGroupBoard: FC = (): ReactElement => {
  const {
    data: tilegroups,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['tile-groups'],
    queryFn: getTileGroups,
  });

  const { data: tiles } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [move, setMove] = useState<boolean>(false);

  const { isChanged, setIsChanged, editTitle, setEditTile } = useDrawerStore();

  const queryClient = useQueryClient();
  const { mutate: postGroup } = useMutation({
    mutationFn: postTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });
    },
  });

  const { mutate: updateTileGroupOrder } = useMutation({
    mutationFn: patchTileGroupOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });
    },
  });

  const { mutate: updateTileOrder } = useMutation({
    mutationFn: patchTileOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  const { mutate: updateTile } = useMutation({
    mutationFn: patchTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
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

  const loadingState = Array(2)
    .fill(0)
    .map((_, i) => (
      <QueryLoading key={i} isLoading={isLoading} tip='Loading tile groups...'>
        <div className='p-[10px] border border-dashed border-zinc-400 rounded-lg bg-white min-h-[235px] my-1'>
          <Row />
        </div>
      </QueryLoading>
    ));

  const errorState = (
    <div className='relative p-[10px] border border-dashed border-zinc-400 rounded-lg bg-white min-h-[235px] my-1'>
      <QueryError className='grid place-content-center' title='Error: Could not load tile group(s)' />
    </div>
  );

  return (
    <>
      <Drawer
        title={'Editing: ' + editTitle?.title}
        placement='right'
        closable
        width='45vw'
        onClose={() => {
          if (isChanged) {
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
                setIsChanged(false);
              }
            });
          } else {
            setEditTile(null);
          }
        }}
        open={editTitle !== null}
        rootStyle={{ position: 'absolute' }}
        getContainer={() => {
          return document.getElementsByClassName('adminContent')[0];
        }}
      >
        {editTitle === null ? '' : <EditTile tile={editTitle} />}
      </Drawer>
      {isLoading ?
        loadingState
      : isError || tilegroups === undefined ?
        errorState
      : <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
          <>
            <SortableContext items={groupIds}>
              {tilegroups.map((group, index) => (
                <AdminTileGroupView key={index} group={group} />
              ))}
            </SortableContext>
            <Button
              type='dashed'
              onClick={() => {
                postGroup({
                  title: 'TileGroup',
                  id: -1,
                  position: tilegroups.length + 1,
                });
              }}
              block
              icon={<PlusOutlined />}
            >
              New Group
            </Button>
          </>
          {createPortal(
            <DragOverlay>
              {activeGroup !== null && <AdminTileGroupView group={activeGroup} />}
              {activeTile !== null && <AdminTileView tile={activeTile} move={move} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      }
    </>
  );

  function onDragStart(event: DragStartEvent): void {
    switch (event.active.data.current?.type) {
      case 'Group':
        setActiveGroup(event.active.data.current.group);
        return;
      case 'Tile':
        setActiveTile(event.active.data.current.tile);
        return;
      default:
        throw new Error('Unknown drag start type encountered');
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
        console.warn('Unknown active object type encountered during drop', activeData.type);
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
        activeData.tile.group_id === overData.tile.group_id ?
          swapTiles(+(activeID as string).substring(1) - 1, +(overID as string).substring(1) - 1, overData)
        : moveTileToGroup(activeData.tile, overData.tile.group_id);
        return;
      default:
        console.warn('Unknown over object type encountered during drop', activeData.type);
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
