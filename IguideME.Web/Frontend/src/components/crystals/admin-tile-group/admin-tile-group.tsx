import { deleteTileGroup, getTiles, patchTileGroup, postTile } from '@/api/tiles';
import AdminTileView from '@/components/crystals/admin-tile-view/admin-tile-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType } from '@/types/grades';
import { TileType, type TileGroup } from '@/types/tile';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Col, Divider, Row } from 'antd';
import { useMemo, type CSSProperties, type FC, type ReactElement } from 'react';
import EditTitle from '../edit-title/edit-title';

interface Props {
  group: TileGroup;
}
const AdminTileGroupView: FC<Props> = ({ group }): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const tiles = data?.filter((tile) => tile.group_id === group.id);

  const queryClient = useQueryClient();

  const { message } = App.useApp();
  const { mutate: addTile } = useMutation({
    mutationFn: postTile,

    onMutate: () => {
      void message.open({
        key: 'tile-add',
        type: 'loading',
        content: 'Adding tile...',
      });
    },

    onError: () => {
      void message.open({
        key: 'tile-add',
        type: 'error',
        content: 'Error adding tile',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });

      void message.open({
        key: 'tile-add',
        type: 'success',
        content: 'Tile added successfully',
        duration: 3,
      });
    },
  });

  const { mutate: patchGroup } = useMutation({
    mutationFn: patchTileGroup,

    onMutate: () => {
      void message.open({
        key: 'group-patch',
        type: 'loading',
        content: 'Saving group...',
      });
    },

    onError: () => {
      void message.open({
        key: 'group-patch',
        type: 'error',
        content: 'Error saving group',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });

      void message.open({
        key: 'group-patch',
        type: 'success',
        content: 'Group saved successfully',
        duration: 3,
      });
    },
  });

  const { mutate: deleteGroup } = useMutation({
    mutationFn: deleteTileGroup,

    onMutate: () => {
      void message.open({
        key: 'group-delete',
        type: 'loading',
        content: 'Deleting group...',
      });
    },

    onError: () => {
      void message.open({
        key: 'group-delete',
        type: 'error',
        content: 'Error deleting group',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });

      void message.open({
        key: 'group-delete',
        type: 'success',
        content: 'Group deleted successfully',
        duration: 3,
      });
    },
  });

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    // Add 1 to the id's because dnd doesn't like 0 as an id.
    id: group.id + 1,
    data: {
      type: 'Group',
      group,
    },
  });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // Add 1 to the id's because dnd doesn't like 0 as an id.
  const tileIds = useMemo(() => (tiles === undefined ? [] : tiles.map((tile) => `t${tile.id + 1}`)), [tiles]);

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
      className={`my-4 min-h-[235px] rounded-lg border border-solid border-border0 bg-surface1 p-[10px] ${isDragging ? 'opacity-40' : ''}`}
      ref={setNodeRef}
      style={style}
    >
      <Row className='cursor-grab content-center justify-between' {...attributes} {...listeners}>
        <Col className='cursor-text'>
          <EditTitle
            title={group.title}
            onSave={(title) => {
              patchGroup({ ...group, title });
            }}
          />
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
