import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  MenuOutlined,
} from '@ant-design/icons';
import { getAssignments } from '@/api/entries';
import { InputNumber, Select, Table, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { PublilshedStatus, type Assignment, type TileEntry } from '@/types/tile';
import { printGradingType } from '@/types/grades';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const Row: FC<HTMLAttributes<HTMLTableRowElement> & { 'data-row-key': string }> = (props) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: CSSProperties = {
    ...props.style,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} />;
};

const GrabHandle: FC<{ id: number }> = ({ id }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <div className='cursor-grab' {...attributes} {...listeners}>
      <MenuOutlined />
    </div>
  );
};

interface SelectAssignmentsWrapperProps {
  value: TileEntry[];
  onChange: (value: TileEntry[]) => void;
}

const SelectAssignmentsWrapper: FC<SelectAssignmentsWrapperProps> = ({ value: entries, onChange: setEntries }) => {
  const [assignments, setAssignments] = useState<Map<number, Assignment>>(new Map<number, Assignment>());

  const { data, isError, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  useEffect(() => {
    if (data) {
      const assignmentMap = new Map<number, Assignment>();

      data.forEach((assignment: Assignment) => {
        assignmentMap.set(assignment.id, assignment);
      });

      setAssignments(assignmentMap);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: any): void => {
    if (active.id !== over?.id) {
      const newEntries = arrayMove(
        entries,
        entries.findIndex((entry) => entry.content_id === active.id),
        entries.findIndex((entry) => entry.content_id === over?.id),
      );
      setEntries(newEntries);
    }
  };

  if (isError) return <QueryError className='static [&_span]:!text-2xl' title={'Error: Could not load assignments'} />;

  return (
    <QueryLoading isLoading={isLoading}>
      <div className='flex flex-col gap-1 overflow-x-auto'>
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext items={entries.map((i) => i.content_id)} strategy={verticalListSortingStrategy}>
            <SelectAssignments assignments={assignments} value={entries} onChange={setEntries} />
          </SortableContext>
        </DndContext>
      </div>
    </QueryLoading>
  );
};

interface SelectAssignmentsProps extends SelectAssignmentsWrapperProps {
  assignments: Map<number, Assignment>;
}

const SelectAssignments: FC<SelectAssignmentsProps> = ({
  assignments,
  value: entries,
  onChange: setEntries,
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  useEffect(() => {
    setSelectedAssignments(entries.map((entry) => entry.content_id));
  }, [entries]);

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
          const existingEntry = entries.find((entry) => entry.content_id === id);

          return {
            title: ass ? ass.title : 'No title found',
            html_url: ass ? ass.html_url : '',
            published: ass?.published ?? PublilshedStatus.NotPublished,
            tile_id: -1, // Set the correct id on the backend
            weight: existingEntry?.weight ?? 0,
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

      setEntries(entries.map((e) => (e.content_id === entry.content_id ? { ...entry, weight } : e)));
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

  return (
    <>
      <Table
        className='[&_div]:!text-text [&_td]:!bg-surface1 [&_td]:!text-text [&_th]:!bg-surface1 [&_th]:!text-text'
        components={{
          body: { row: Row },
        }}
        columns={[
          {
            title: '',
            dataIndex: 'grab',
            key: 'grab',
            align: 'center',
            render: (_, entry) => <GrabHandle id={entry.content_id} />,
            width: 30,
          },
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
                  {assignment !== undefined && Boolean(assignment.published) ?
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
                  changeOnWheel
                  className='antNumberInput w-full !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
                  data-no-drag
                  value={entry.weight}
                  onChange={(val) => {
                    changeWeight(entry, val);
                  }}
                  onFocus={(e) => {
                    e.target.select();
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
        dataSource={entries}
        rowKey='content_id'
      />

      <Select
        className='[&>div]:hover:!border-accent[&_span]:!text-text w-full [&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!bg-surface2'
        popupClassName='bg-surface1 [&_div]:!text-text selectionSelected'
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
    </>
  );

  function distributeWeights(): void {
    const weight = 1 / entries.length;
    entries.forEach((entry) => (entry.weight = weight));
    setEntries([...entries]);
  }
};

export default SelectAssignmentsWrapper;
