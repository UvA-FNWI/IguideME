import { useState, type FC, type ReactElement, useMemo } from 'react';
import { TileType, type TileGroup, GradingType } from '@/types/tile';

import { Button, Col, Divider, Input, Row } from 'antd';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteTileGroup, getTiles, patchTileGroup, postTile } from '@/api/tiles';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import Loading from '@/components/particles/loading';
import AdminTileView from '@/components/crystals/admin-tile-view/admin-tile-view';

interface Props {
  group: TileGroup;
}
const AdminTileGroupView: FC<Props> = ({ group }): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(group.title);
  const { data, isFetching } = useQuery('tiles', getTiles);

  const tiles = data?.filter((tile) => tile.group_id === group.id);

  const queryClient = useQueryClient();

  const { mutate: addTile } = useMutation({
    mutationFn: postTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tiles');
    },
  });

  const { mutate: patchGroup } = useMutation({
    mutationFn: patchTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tile-groups');
    },
  });

  const { mutate: deleteGroup } = useMutation({
    mutationFn: deleteTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries('tile-groups');
    },
  });

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    // Add 1 to the id's because dnd doesn't like 0 as an id.
    id: group.id + 1,
    data: {
      type: 'Group',
      group,
    },
    disabled: editing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Add 1 to the id's because dnd doesn't like 0 as an id.
  const tileIds = useMemo(() => (tiles === undefined ? [] : tiles.map((tile) => `t${tile.id + 1}`)), [tiles]);

  if (isDragging) {
    return (
      <div
        className="p-[10px] border border-dashed border-zinc-500 rounded-lg bg-white min-h-[235px]"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (tiles === undefined || isFetching) {
    return (
      <Row>
        <Loading />
      </Row>
    );
  }

  return (
    <div
      className="p-[10px] border border-dashed border-zinc-400 rounded-lg bg-white min-h-[235px] my-1"
      ref={setNodeRef}
      style={style}
    >
      <Row align="middle" className="cursor-grab" justify="space-between" {...attributes} {...listeners}>
        <Col className="cursor-text">
          <h2
            className="text-lg p-1"
            onClick={() => {
              setEditing(true);
            }}
          >
            {!editing
              ? group.title
              : editing && (
                  <Input
                    value={title}
                    autoFocus
                    onBlur={() => {
                      setEditing(false);
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      patchGroup({
                        id: group.id,
                        title,
                        position: group.position,
                      });
                      setEditing(false);
                    }}
                  />
                )}
          </h2>
        </Col>
        <Col>
          <DeleteFilled
            className="p-1"
            onClick={() => {
              deleteGroup(group.id);
            }}
          />
        </Col>
      </Row>
      <Divider className="mt-1 mb-2" />
      <Row gutter={[20, 20]} className="p-[10px]" justify="start">
        <SortableContext items={tileIds}>
          {tiles === undefined ? (
            <Loading />
          ) : (
            tiles.map((tile, index) => (
              <Col key={index}>
                <AdminTileView tile={tile} />
              </Col>
            ))
          )}
        </SortableContext>
        <Col>
          <Button
            type="dashed"
            onClick={() => {
              addTile({
                id: -1,
                group_id: group.id,
                title: 'Title',
                weight: 0,
                position: tiles === undefined ? 1 : tiles.length + 1,
                type: TileType.assignments,
                visible: false,
                notifications: false,
                gradingType: GradingType.Percentage,
                entries: [],
              });
            }}
            block
            icon={<PlusOutlined />}
            className="h-full !w-60 m-0 min-h-[150px]"
          >
            New Tile
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AdminTileGroupView;
