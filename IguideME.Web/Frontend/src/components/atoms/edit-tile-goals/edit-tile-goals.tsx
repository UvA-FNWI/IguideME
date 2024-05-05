import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Form, Select, Switch, Table } from 'antd';
import { getLearningGoals } from '@/api/entries';
import type { LearningGoal, TileEntry } from '@/types/tile';
import { useDrawerStore } from '@/components/crystals/tile-group-board/useDrawerStore';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState, type FC, type ReactElement } from 'react';

const { Item } = Form;

const EditTileGoals: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['learning-goals'],
    queryFn: getLearningGoals,
  });

  if (isError) return <QueryError className='static [&_span]:!text-2xl' title={'Error: Could not load goals'} />;

  return (
    <>
      <p className='mb-1'>Goals:</p>
      <div className='col-span-2'>
        <Item name='alt' noStyle valuePropName='checked'>
          <Switch className='float-end' checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Item>
      </div>
      <div className='col-span-3'>
        <QueryLoading isLoading={isLoading}>
          <Item name='entries' className='w-full m-0'>
            <TileGoalsSelect goals={data ?? []} value={[]} onChange={() => {}} />
          </Item>
        </QueryLoading>
      </div>
    </>
  );
};

type TileGoalsSelectProps = {
  goals: LearningGoal[];
  value: TileEntry[];
  onChange: (value: TileEntry[]) => void;
};

const TileGoalsSelect: FC<TileGoalsSelectProps> = ({ goals, value: entries, onChange: setEntries }): ReactElement => {
  const [selectedGoals, setSelectedGoals] = useState<number[]>(entries.map((entry) => entry.content_id));
  const [open, setOpen] = useState<boolean>(false);

  const unselectedGoals: LearningGoal[] = [...goals.values()].filter((top) => {
    return !selectedGoals.some((sel) => sel === top.id);
  });

  const { setIsChanged } = useDrawerStore((state) => ({
    setIsChanged: state.setIsChanged,
  }));

  const onSelectChange = useCallback(
    (selected: number[]): void => {
      setIsChanged(true);
      setOpen(false);
      setSelectedGoals(selected);
      setEntries(
        selected.map((id) => {
          const goal = goals.find((g) => g.id === id);
          return {
            title: goal!.title,
            tile_id: -1, // Set the correct id on the backend
            weight: 0,
            content_id: id,
          };
        }),
      );
    },
    [goals],
  );

  const removeEntry = (rid: number): void => {
    setSelectedGoals(selectedGoals.filter((id) => id !== rid));
    setEntries(entries.filter((e) => e.content_id !== rid));
  };

  return (
    <div className='flex flex-col gap-1'>
      <Table
        className='[&_th]:!bg-cardBackground [&_th]:!text-text [&_td]:!bg-dropdownBackground [&_td]:!text-text [&_div]:!text-text'
        columns={[
          {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Requiremens',
            dataIndex: 'requirements',
            key: 'requirements',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              const goal = goals.find((top) => top.id === entry.content_id);
              return goal?.requirements.length;
            },
          },
          {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              return (
                <DeleteFilled
                  className='text-primary-red'
                  onClick={() => {
                    removeEntry(entry.content_id);
                  }}
                />
              );
            },
          },
        ]}
        pagination={false}
        dataSource={entries.sort((a, b) => a.title.localeCompare(b.title))}
        rowKey='content_id'
      />

      <Select
        className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
        dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
        value={selectedGoals}
        mode='multiple'
        options={unselectedGoals?.map((ass) => ({
          value: ass.id,
          label: ass.title,
        }))}
        open={open}
        onDropdownVisibleChange={(visible) => {
          setOpen(visible);
        }}
        onChange={onSelectChange}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        tagRender={() => <></>}
        onInputKeyDown={(event) => {
          if (event.key === 'Backspace') {
            event.stopPropagation();
          }
        }}
      />
    </div>
  );
};

export default EditTileGoals;
