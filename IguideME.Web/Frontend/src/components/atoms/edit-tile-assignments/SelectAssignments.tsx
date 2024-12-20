import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteFilled } from '@ant-design/icons';
import { getAssignments } from '@/api/entries';
import { InputNumber, Select, Table, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type FC, type ReactElement } from 'react';

import { PublilshedStatus, type Assignment, type TileEntry } from '@/types/tile';
import { printGradingType } from '@/types/grades';

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
            html_url: ass ? ass.html_url : '',
            published: ass?.published ?? PublilshedStatus.NotPublished,
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
          className='[&_div]:!text-text [&_td]:!bg-surface1 [&_td]:!text-text [&_th]:!bg-surface1 [&_th]:!text-text'
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
                return (
                  <a href={assignment?.html_url} target='_blank' rel='noopener noreferrer'>
                    {assignment !== undefined && assignment.published ?
                      <CheckCircleOutlined className='text-success' />
                    : <CloseCircleOutlined className='text-failure' />}
                  </a>
                );
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
              title: (
                <div className='flex w-20 place-content-center items-center justify-between'>
                  <div>Weight</div>
                  <div>
                    <Tooltip title='Evenly distribute weights over entries'>
                      <ApartmentOutlined onClick={distributeWeights} />
                    </Tooltip>
                  </div>
                </div>
              ),
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
              render: (_: string, entry: TileEntry) => {
                return (
                  <InputNumber
                    className='antNumberInput !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text w-full !border border-solid'
                    value={entry.weight}
                    onChange={(val) => {
                      changeWeight(entry, val);
                    }}
                    formatter={(value) => `${((value ?? 0) * 100).toFixed(1)}%`}
                    parser={(value) => parseFloat((value ?? '0').replace('%', '')) / 100}
                    step={0.01}
                    variant='borderless'
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
                    className='text-failure'
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
          className='[&>div]:hover:!border-accent[&_span]:!text-text [&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:hover:!bg-surface2 w-full [&>div]:!shadow-none'
          dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
          value={selectedAssignments}
          mode='multiple'
          options={options}
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
    </QueryLoading>
  );
  function distributeWeights() {
    const weight = 1 / entries.length;
    entries.forEach((entry) => (entry.weight = weight));
    setEntries(entries);
  }
};

export default SelectAssignments;
