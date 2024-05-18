import { deleteTileGroup, getTiles, patchTileGroup, postTile } from '@/api/tiles';
import AdminTileView from '@/components/crystals/admin-tile-view/admin-tile-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType, TileType, type TileGroup } from '@/types/tile';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Divider, Input, Row } from 'antd';
import { useMemo, useState, type FC, type ReactElement } from 'react';

interface Props {
  group: TileGroup;
}
const AdminTileGroupView: FC<Props> = ({ group }): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(group.title);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const tiles = data?.filter((tile) => tile.group_id === group.id);

  const queryClient = useQueryClient();

  const { mutate: addTile } = useMutation({
    mutationFn: postTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  const { mutate: patchGroup } = useMutation({
    mutationFn: patchTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });
    },
  });

  const { mutate: deleteGroup } = useMutation({
    mutationFn: deleteTileGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });
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
        className='bg-accent/50 min-h-[235px] rounded-lg border border-dashed border-text p-[10px]'
        ref={setNodeRef}
        style={style}
      />
    );
  }

  const loadingState = Array(Math.floor(Math.random() * 5) + 1)
    .fill(0)
    .map((_, i) => (
      <QueryLoading key={i} isLoading={isLoading}>
        <div className='m-0 h-[150px] w-60 rounded-md border border-solid border-text bg-surface1' />
      </QueryLoading>
    ));

  const errorState = (
    <Col>
      <div className='relative m-0 h-[150px] w-60 rounded-md border border-solid border-text bg-surface1'>
        <QueryError className='grid place-content-center' title='Error: Could not load tile' />
      </div>
    </Col>
  );

  return (
    <div
      className='my-4 min-h-[235px] rounded-lg border border-solid border-border0 bg-surface1 p-[10px]'
      ref={setNodeRef}
      style={style}
    >
      <Row className='cursor-grab content-center justify-between' {...attributes} {...listeners}>
        <Col className='cursor-text'>
          <h2
            className='p-1 text-lg'
            onClick={() => {
              setEditing(true);
            }}
          >
            {!editing ?
              group.title
            : editing && (
                <Input
                  className='w-full border-accent bg-surface1 text-text hover:border-accent/50 hover:bg-surface1 focus:bg-surface1 focus:border-accent focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
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
              )
            }
          </h2>
        </Col>
        <Col>
          <DeleteFilled
            className='p-1 text-failure'
            onClick={() => {
              deleteGroup(group.id);
            }}
          />
        </Col>
      </Row>
      <Divider className='mb-2 mt-1' />
      <Row gutter={[20, 20]} className='justify-start p-[10px]'>
        <SortableContext items={tileIds}>
          {isLoading ?
            <div className='flex gap-2'>{loadingState}</div>
          : isError || tiles === undefined ?
            errorState
          : tiles.map((tile, index) => (
              <Col key={index}>
                <AdminTileView tile={tile} />
              </Col>
            ))
          }
        </SortableContext>
        <Col>
          <Button
            type='dashed'
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
                alt: false,
              });
            }}
            block
            icon={<PlusOutlined />}
            className='m-0 h-full min-h-[150px] !w-60 border border-accent/70 bg-accent/20 text-text hover:!border-accent hover:!bg-accent hover:!text-text'
          >
            New Tile
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AdminTileGroupView;
