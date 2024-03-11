import { TileType, type Tile, printGradingType } from '@/types/tile';
import { useContext, type FC, type ReactElement } from 'react';
import { Col, Row, Space, Tooltip } from 'antd';
import {
  BellTwoTone,
  CarryOutOutlined,
  CommentOutlined,
  DeleteFilled,
  EyeInvisibleTwoTone,
  EyeTwoTone,
  FormOutlined,
} from '@ant-design/icons';
import { deleteTile, patchTile } from '@/api/tiles';
import { useMutation, useQueryClient } from 'react-query';
import { CSS } from '@dnd-kit/utilities';

import { useSortable } from '@dnd-kit/sortable';
import { DrawerContext } from '../tile-group-board/contexts';
import Swal from 'sweetalert2';

const GREEN = 'rgb(55, 212, 63)';
const GREEN_BG = 'rgba(55, 212, 63, 0.1)';
const RED = 'rgb(252, 69, 3)';
const RED_BG = 'rgba(252, 69, 3, 0.1)';

interface Props {
  tile: Tile;
  move?: boolean;
}

const AdminTileView: FC<Props> = ({ tile, move }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: removeTile } = useMutation({
    mutationFn: deleteTile,
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

  const { setEditTile } = useContext(DrawerContext);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `t${tile.id + 1}`,
    data: {
      type: 'Tile',
      tile,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    background: tile.visible ? GREEN_BG : RED_BG,
  };

  const toggleVisible = (): void => {
    updateTile({ ...tile, visible: !tile.visible });
  };

  const toggleNotifications = (): void => {
    updateTile({ ...tile, notifications: !tile.notifications });
  };

  if (isDragging) {
    return (
      <div
        className="w-60 h-full p-3 border border-solid border-zinc-300 rounded-md m-0 bg-white font-tnum"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (move === true) {
    return (
      <div
        className="w-60 h-full p-3 border border-solid border-zinc-300 rounded-md m-0 bg-white font-tnum"
        ref={setNodeRef}
        style={style}
      >
        <div className="flex justify-center items-center h-full">
          <p>Move here</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-60 h-full p-3 border border-solid border-zinc-300 rounded-md m-0 bg-white font-tnum"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        setEditTile(tile);
      }}
    >
      <Row align="middle" justify="space-between" gutter={[10, 10]} className="mb-6">
        <Col>
          <Space align="center">
            <Tooltip title={<>This tile is {!tile.visible && <b>not </b>}visible for students</>}>
              {tile.visible ? (
                <EyeTwoTone
                  twoToneColor={GREEN}
                  className="text-xs"
                  onClick={(event) => {
                    clickThrough(event, toggleVisible);
                  }}
                />
              ) : (
                <EyeInvisibleTwoTone
                  twoToneColor={RED}
                  className="text-xs"
                  onClick={(event) => {
                    clickThrough(event, toggleVisible);
                  }}
                />
              )}
            </Tooltip>
            <Tooltip
              title={
                <>
                  Notifications are toggled <b>{tile.notifications ? 'on' : 'off'}</b>
                </>
              }
            >
              <BellTwoTone
                twoToneColor={tile.notifications ? GREEN : RED}
                onClick={(event) => {
                  clickThrough(event, toggleNotifications);
                }}
                className="text-xs"
              />
            </Tooltip>
            <h3 className="ml-[10px] pt-[2px]">{tile.title}</h3>
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
            className="pr-1"
          />
        </Col>
      </Row>
      <Row justify="space-between" className="mt-[10px]">
        <Col>
          <TileTypeView tileType={tile.type} />
        </Col>
      </Row>
      <Row align="middle" justify="space-between" className="pt-[30px]">
        <Col className="h-[30px]">
          {tile.type === TileType.assignments && (
            <>
              <h4 className="font-maitree">Grading:</h4>
              <p>{printGradingType(tile.gradingType)}</p>
            </>
          )}
        </Col>
        {tile.weight > 0 && (
          <Col className="text-center h-[30px]">
            <h4 className="font-maitree">Weight:</h4>
            <p>{tile.weight * 100}%</p>
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
        <Tooltip title="Assignment tiles group together assignments and quizzes completed by the students. These can be obtained from an LMS or uploaded manually">
          <Space align="center" size={3}>
            <FormOutlined /> <h4 className="font-maitree">Assignments</h4>
          </Space>
        </Tooltip>
      );
    case TileType.discussions:
      return (
        <Tooltip title="Discussion tiles give an overview of the messages the students have posted as well as the number of messages.">
          <Space align="center" size={3}>
            <CommentOutlined /> <h4 className="font-maitree">Discussions</h4>
          </Space>
        </Tooltip>
      );
    case TileType.learning_outcomes:
      return (
        <Tooltip title="Learning Goal tiles keep track of requirements or goals the students should complete during the course. Some examples of these are: the average of the partial exams must exceed X, students need to submit 10 discussions for participation, passing an extra assignments for honours, etc.">
          <Space align="center" size={3}>
            <CarryOutOutlined /> <h4 className="font-maitree">Learning Goals</h4>
          </Space>
        </Tooltip>
      );
  }
};

export default AdminTileView;
