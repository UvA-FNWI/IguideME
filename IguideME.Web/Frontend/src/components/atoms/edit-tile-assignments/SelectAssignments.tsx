import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import {
  CheckCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  CloseCircleTwoTone,
  DeleteFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import { getAssignments } from '@/api/entries';
import { InputNumber, Select, Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type FC, type ReactElement } from 'react';

import { printGradingType, type Assignment, type TileEntry } from '@/types/tile';

interface SelectAssignmentsProps {
  value: TileEntry[];
  onChange: (value: TileEntry[]) => void;
}

const SelectAssignments: FC<SelectAssignmentsProps> = ({ value: entries, onChange: setEntries }): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  const [assignments, setAssignments] = useState<Map<number, Assignment>>(new Map<number, Assignment>());
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAssignments(entries.map((entry) => entry.content_id));
  }, [entries]);

  useEffect(() => {
    if (data) {
      const assignmentMap = new Map<number, Assignment>();

      data.forEach((assignment: Assignment) => {
        assignmentMap.set(assignment.id, assignment);
      });

      setAssignments(assignmentMap);
    }
  }, [data]);

  const unselectedAssignments = useMemo(() => {
    return [...assignments.values()].filter((ass) => {
      return !selectedAssignments.some((sel) => sel === ass.id);
    });
  }, [assignments, selectedAssignments]);

  const options = useMemo(
    () =>
      unselectedAssignments?.map((ass) => ({
        value: ass.id,
        label: ass.title,
      })),
    [unselectedAssignments],
  );

  const onSelectChange = useCallback(
    (selected: number[]): void => {
      setOpen(false);
      setSelectedAssignments(selected);
      setEntries(
        selected.map((id) => {
          const ass = assignments.get(id);
          return {
            title: ass ? ass.title : 'No title found',
            tile_id: -1, // Set the correct id on the backend
            weight: 0,
            content_id: id,
          };
        }),
      );
    },
    [assignments],
  );

  const changeWeight = useCallback(
    (entry: TileEntry, weight: number | null): void => {
      if (weight === null) return;

      setEntries([...entries.filter((e) => e.content_id !== entry.content_id), { ...entry, weight }]);
    },
    [entries],
  );

  const removeEntry = useCallback(
    (rid: number): void => {
      setSelectedAssignments(selectedAssignments.filter((id) => id !== rid));
      setEntries(entries.filter((e) => e.content_id !== rid));
    },
    [entries, selectedAssignments],
  );

  if (isError) return <QueryError className='static [&_span]:!text-2xl' title={'Error: Could not load assignments'} />;

  return (
    <QueryLoading isLoading={isLoading}>
      <div className='flex flex-col gap-1 overflow-x-auto'>
        <Table
          className='[&_th]:!bg-cardBackground [&_th]:!text-text [&_td]:!bg-dropdownBackground [&_td]:!text-text [&_div]:!text-text'
          columns={[
            {
              title: 'Name',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Published',
              dataIndex: 'published',
              key: 'published',
              align: 'center',
              render: (_: string, entry: TileEntry) => {
                const assignment = assignments.get(entry.content_id);
                return assignment !== undefined && assignment.published ?
                    <CheckCircleOutlined className='text-primary-green' />
                  : <CloseCircleOutlined className='text-primary-red' />;
              },
            },
            {
              title: 'Grading',
              dataIndex: 'grading',
              key: 'grading',
              align: 'center',
              render: (_: string, entry: TileEntry) => {
                const assignment = assignments.get(entry.content_id);
                if (assignment !== undefined) {
                  return printGradingType(assignment?.grading_type);
                }
              },
            },
            {
              title: 'Weight',
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
              render: (_: string, entry: TileEntry) => {
                return (
                  <InputNumber
                    className='!border-primary-500 hover:!border-primary-500 !bg-cardBackground hover:!bg-dropdownBackground [&_input]:!text-text antNumberInput'
                    value={entry.weight}
                    onChange={(val) => {
                      changeWeight(entry, val);
                    }}
                    formatter={(value) => `${(value ?? 0) * 100}%`}
                    parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
                  />
                );
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
          value={selectedAssignments}
          mode='multiple'
          options={options}
          open={open}
          onDropdownVisibleChange={(visible) => setOpen(visible)}
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
    </QueryLoading>
  );
};

export default SelectAssignments;
