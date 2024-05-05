import EditTileAssignments from '@/components/atoms/edit-tile-assignments/edit-tile-assignments';
import EditTileDiscussions from '@/components/atoms/edit-tile-discussions/edit-tile-discussions';
import EditTileGoals from '@/components/atoms/edit-tile-goals/edit-tile-goals';
import Swal from 'sweetalert2';
import { BellOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { deleteTile, patchTile } from '@/api/tiles';
import { useDrawerStore } from '../tile-group-board/useDrawerStore';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FormInstance } from 'antd/lib/form/Form';
import { TileType, type Tile } from '@/types/tile';
import { useState, type FC, type ReactElement } from 'react';

interface Props {
  tile: Tile;
}

const { Item } = Form;

const EditTile: FC<Props> = ({ tile }): ReactElement => {
  const [form] = useForm<Tile>();
  const queryClient = useQueryClient();
  const { setIsChanged, setEditTile } = useDrawerStore((state) => ({
    setIsChanged: state.setIsChanged,
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
      name='edit_tile_form'
      initialValues={tile}
      onFinish={(data: Tile) => {
        console.log("data", data)
        setEditTile(null);
        saveTile(data);
        setIsChanged(false);
      }}
      requiredMark={false}
      className='flex flex-col gap-2 w-full'
      onValuesChange={() => {
        setIsChanged(true);
      }}
    >
      <Item name='id' hidden>
        <Input type='hidden' />
      </Item>
      <Item name='group_id' hidden>
        <Input type='hidden' />
      </Item>
      <Item name='position' hidden>
        <Input type='hidden' />
      </Item>
      <div
        className='grid grid-cols-3 gap-2 items-center'
        style={{ gridTemplateColumns: 'min-content 1fr min-content' }}
      >
        <p>Title:</p>
        <Item name='title' rules={[{ required: true, message: 'Please insert a title for the tile' }]} noStyle>
          <Input className='w-full border-primary-500 hover:border-primary-500 bg-cardBackground hover:bg-dropdownBackground text-text' />
        </Item>
        <div className='flex gap-2'>
          <Item name='notifications' noStyle>
            <Notification />
          </Item>
          <Item name='visible' noStyle>
            <Visible />
          </Item>
        </div>

        <p>Type:</p>
        <div className='col-span-2'>
          <Item name='type' noStyle>
            <TypeSelector value={0} onChange={() => {}} form={form} />
          </Item>
        </div>
        {renderTypeSettings()}
      </div>
      <div className='flex gap-2'>
        <Item>
          <Button
            className='min-w-20 bg-primary-500 hover:!bg-primary-600 [&_span]:text-text'
            type='primary'
            htmlType='submit'
          >
            Save
          </Button>
        </Item>

        <Item>
          <Button
            className='min-w-20 bg-primary-red hover:!bg-red-400 [&_span]:text-text'
            type='primary'
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
      </div>
    </Form>
  );

  function renderTypeSettings(): ReactElement {
    // TODO: delete entries when changing types.
    const type = useWatch('type', form);
    switch (type) {
      case TileType.assignments:
        return <EditTileAssignments />;
      case TileType.discussions:
        return <EditTileDiscussions />;
      case TileType.learning_outcomes:
        return <EditTileGoals />;
      default:
        return <></>;
    }
  }
};

interface TypeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  form: FormInstance<Tile>;
}

const TypeSelector: FC<TypeSelectorProps> = ({ value, onChange, form }): ReactElement => {
  const update = (args: number): void => {
    form.setFieldValue('entries', []);
    onChange(args);
  };

  return (
    <Select
      className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
      dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
      options={[
        { value: TileType.assignments, label: 'Assignments' },
        { value: TileType.discussions, label: 'Discussions' },
        {
          value: TileType.learning_outcomes,
          label: 'Learning Outcomes',
        },
      ]}
      value={value}
      onChange={update}
    />
  );
};

const Notification: FC<{
  value?: boolean;
  onChange?: (value: boolean) => void;
}> = ({ value, onChange }): ReactElement => {
  const [notifications, setNotifications] = useState<boolean | undefined>(value);

  return (
    <Button
      className='border-primary-500 hover:!border-primary-500 bg-cardBackground hover:!bg-dropdownBackground text-text grid place-content-center'
      shape='circle'
      icon={<BellOutlined className={`${notifications ? 'text-primary-green' : 'text-primary-red'}`} />}
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
      className='border-primary-500 hover:!border-primary-500 bg-cardBackground hover:!bg-dropdownBackground text-text grid place-content-center'
      shape='circle'
      icon={
        visible === true ?
          <CheckCircleOutlined className='text-xs text-primary-green' />
        : <StopOutlined className='text-xs text-primary-red' />
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
