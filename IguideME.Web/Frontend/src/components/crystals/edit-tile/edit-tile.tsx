import EditTileAssignments from '@/components/atoms/edit-tile-assignments/edit-tile-assignments';
import EditTileDiscussions from '@/components/atoms/edit-tile-discussions/edit-tile-discussions';
import EditTileGoals from '@/components/atoms/edit-tile-goals/edit-tile-goals';
import Swal from 'sweetalert2';
import { BellTwoTone, CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { deleteTile, patchTile } from '@/api/tiles';
import { useDrawerStore } from '../tile-group-board/useDrawerStore';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TileType, type Tile } from '@/types/tile';
import { type FC, type ReactElement, useState } from 'react';

interface Props {
  tile: Tile;
}

const GREEN = 'rgb(55, 212, 63)';
const RED = 'rgb(252, 69, 3)';

const { Item } = Form;

const EditTile: FC<Props> = ({ tile }): ReactElement => {
  const [form] = useForm<Tile>();
  const queryClient = useQueryClient();
  const { setEditTile } = useDrawerStore((state) => ({
    setEditTile: state.setEditTile,
  }));

  const { mutate: saveTile } = useMutation({
    mutationFn: patchTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  const { mutate: removeTile } = useMutation({
    mutationFn: deleteTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  return (
    <Form<Tile>
      form={form}
      name="edit_tile_form"
      initialValues={tile}
      onFinish={(data: Tile) => {
        setEditTile(null);
        saveTile(data);
      }}
      requiredMark={false}
      className="flex flex-col gap-2"
    >
      <Item name="id" hidden>
        <Input type="hidden" />
      </Item>
      <Item name="group_id" hidden>
        <Input type="hidden" />
      </Item>
      <Item name="position" hidden>
        <Input type="hidden" />
      </Item>
      <Row className="content-center">
        <Col span={4} className="grid items-center">
          Title:
        </Col>
        <Col span={8}>
          <Item name="title" rules={[{ required: true, message: 'Please insert a title for the tile' }]} noStyle>
            <Input className="w-full" />
          </Item>
        </Col>
        <Col span={4} offset={8}>
          <Space>
            <Item name="notifications" noStyle>
              <Notification />
            </Item>
            <Item name="visible" noStyle>
              <Visible />
            </Item>
          </Space>
        </Col>
      </Row>

      <Row className="content-center">
        <Col span={4} className="grid items-center">
          Type:
        </Col>
        <Col span={8}>
          <Item name="type" noStyle>
            <Select
              className="w-full"
              options={[
                { value: TileType.assignments, label: 'Assignments' },
                { value: TileType.discussions, label: 'Discussions' },
                {
                  value: TileType.learning_outcomes,
                  label: 'Learning Outcomes',
                },
              ]}
            />
          </Item>
        </Col>
      </Row>
      {renderTypeSettings()}
      <Row className="flex gap-1 [&_*]:m-0">
        <Col>
          <Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Item>
        </Col>
        <Col>
          <Item>
            <Button
              type="primary"
              danger
              onClick={() => {
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
            >
              Delete
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );

  function renderTypeSettings(): ReactElement {
    // TODO: delete entries when changing types.
    const type = useWatch('type', form);
    switch (type) {
      case TileType.assignments:
        return <EditTileAssignments></EditTileAssignments>;
      case TileType.discussions:
        return <EditTileDiscussions></EditTileDiscussions>;
      case TileType.learning_outcomes:
        return <EditTileGoals></EditTileGoals>;
    }
  }
};

const Notification: FC<{
  value?: boolean;
  onChange?: (value: boolean) => void;
}> = ({ value, onChange }): ReactElement => {
  const [notifications, setNotifications] = useState<boolean | undefined>(value);

  return (
    <Button
      shape="circle"
      icon={<BellTwoTone twoToneColor={notifications === true ? GREEN : RED} />}
      onClick={() => {
        if (notifications === undefined) return;
        setNotifications(!notifications);
        onChange?.(!notifications);
      }}
    />
  );
};

const Visible: FC<{ value?: boolean; onChange?: (value: boolean) => void }> = ({ value, onChange }): ReactElement => {
  const [visible, setVisible] = useState<boolean | undefined>(value);

  return (
    <Button
      shape="circle"
      icon={
        visible === true ? (
          <CheckCircleTwoTone twoToneColor={GREEN} className="text-xs" />
        ) : (
          <StopTwoTone twoToneColor={RED} className="text-xs" />
        )
      }
      onClick={() => {
        if (visible === undefined) return;
        setVisible(!visible);
        onChange?.(!visible);
      }}
    />
  );
};

export default EditTile;
