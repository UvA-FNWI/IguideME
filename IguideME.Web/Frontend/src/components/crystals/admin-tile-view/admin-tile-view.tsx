import Swal from 'sweetalert2';
import {
  BellOutlined,
  CarryOutOutlined,
  CommentOutlined,
  DeleteFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Col, Row, Space, Tooltip } from 'antd';
import { CSS } from '@dnd-kit/utilities';
import { deleteTile, patchTile } from '@/api/tiles';
import { useDrawerStore } from '../tile-group-board/useDrawerStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSortable } from '@dnd-kit/sortable';
import { TileType, type Tile } from '@/types/tile';
import { useMemo, type FC, type ReactElement } from 'react';
import { printGradingType } from '@/types/grades';

interface Props {
  tile: Tile;
  move?: boolean;
}

const AdminTileView: FC<Props> = ({ tile, move }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: removeTile } = useMutation({
    mutationFn: deleteTile,
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

  const { setEditTile } = useDrawerStore((state) => ({
    setEditTile: state.setEditTile,
  }));

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `t${tile.id + 1}`,
    data: {
      type: 'Tile',
      tile,
    },
  });

  const tileStyle = useMemo(
    () =>
      `font-tnum m-0 h-full w-60 rounded-md border border-solid border-border1 p-3 ${tile.visible ? 'bg-success/10' : 'bg-failure/10'}`,
    [tile],
  );

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleVisible = (): void => {
    updateTile({ ...tile, visible: !tile.visible });
  };

  const toggleNotifications = (): void => {
    updateTile({ ...tile, notifications: !tile.notifications });
  };

  if (isDragging) {
    return <div className={tileStyle} ref={setNodeRef} style={style} />;
  }

  if (move === true) {
    return (
      <div className={tileStyle} ref={setNodeRef} style={style}>
        <div className='flex h-full items-center justify-center'>
          <p>Move here</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={tileStyle}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        setEditTile(tile);
      }}
    >
      <Row gutter={[10, 10]} className='mb-6 content-center justify-between'>
        <Col>
          <Space className='content-center'>
            <Tooltip title={<>This tile is {!tile.visible && <b>not </b>}visible for students</>}>
              {tile.visible ?
                <EyeOutlined
                  className='text-success text-xs'
                  onClick={(event) => {
                    clickThrough(event, toggleVisible);
                  }}
                />
              : <EyeInvisibleOutlined
                  className='text-failure text-xs'
                  onClick={(event) => {
                    clickThrough(event, toggleVisible);
                  }}
                />
              }
            </Tooltip>
            <Tooltip
              title={
                <>
                  Notifications are toggled <b>{tile.notifications ? 'on' : 'off'}</b>
                </>
              }
            >
              <BellOutlined
                onClick={(event) => {
                  clickThrough(event, toggleNotifications);
                }}
                className={`text-xs ${tile.notifications ? 'text-success' : 'text-failure'}`}
              />
            </Tooltip>
            <h3 className='ml-[10px] pt-[2px]'>{tile.title}</h3>
          </Space>
        </Col>
        <Col>
          <DeleteFilled
            onClick={(event) => {
              event.stopPropagation();
              void Swal.fire({
                title: 'Warning: This will permanently delete the tile!',
                icon: 'warning',
                focusCancel: true,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                customClass: {},
              }).then((result) => {
                if (result.isConfirmed) {
                  setEditTile(null);
                  removeTile(tile.id);
                }
              });
            }}
            className='text-failure pr-1'
          />
        </Col>
      </Row>
      <Row className='mt-[10px] justify-between'>
        <Col>
          <TileTypeView tileType={tile.type} />
        </Col>
      </Row>
      <Row className='content-center justify-between pt-[30px]'>
        <Col className='h-[30px]'>
          {tile.type === TileType.assignments && (
            <>
              <p className='text-xs'>
                Grading:
                <br />
                {printGradingType(tile.gradingType)}
              </p>
            </>
          )}
        </Col>
        {tile.weight > 0 && (
          <Col className='h-[30px] text-center'>
            <p className='text-xs'>
              Weight:
              <br />
              {tile.weight * 100}%
            </p>
          </Col>
        )}
      </Row>
    </div>
  );

  function clickThrough(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, func: () => void): void {
    event.stopPropagation();
    func();
  }
};

const TileTypeView: FC<{ tileType: TileType }> = ({ tileType }): ReactElement => {
  switch (tileType) {
    case TileType.assignments:
      return (
        <Tooltip title='Assignment tiles group together assignments and quizzes completed by the students. These can be obtained from an LMS or uploaded manually'>
          <Space align='center' size={3}>
            <FormOutlined className='text-text' /> <p className='text-sm'>Assignments</p>
          </Space>
        </Tooltip>
      );
    case TileType.discussions:
      return (
        <Tooltip title='Discussion tiles give an overview of the messages the students have posted as well as the number of messages.'>
          <Space align='center' size={3}>
            <CommentOutlined className='text-text' /> <p className='text-sm'>Discussions</p>
          </Space>
        </Tooltip>
      );
    case TileType.learning_outcomes:
      return (
        <Tooltip title='Learning Goal tiles keep track of requirements or goals the students should complete during the course. Some examples of these are: the average of the partial exams must exceed X, students need to submit 10 discussions for participation, passing an extra assignments for honours, etc.'>
          <Space align='center' size={3}>
            <CarryOutOutlined className='text-text' /> <p className='text-sm'>Learning Goals</p>
          </Space>
        </Tooltip>
      );
  }
};

export default AdminTileView;
