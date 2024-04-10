import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Button, Col, Row } from 'antd';
import { createPortal } from 'react-dom';
import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { type LayoutColumn } from '@/types/tile';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const LayoutConfigurator: FC = (): ReactElement => {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['layout-columns'],
    queryFn: getLayoutColumns,
  });

  const { mutate: saveLayout } = useMutation({
    mutationFn: postLayoutColumns,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['layout-columns'] });
    },
  });

  const [active, setActive] = useState<LayoutColumn | null>(null);
  const [columns, setColumns] = useState<LayoutColumn[]>([]);
  useEffect(() => {
    if (data !== undefined) setColumns(data);
  }, [data]);

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
  );

  const addColumn = (): void => {
    setColumns([
      ...columns,
      {
        id: -columns.length,
        width: 50,
        position: columns.length,
        groups: [],
      },
    ]);
  };

  function onDragEnd(event: DragEndEvent): void {
    setActive(null);
    const { active, over } = event;
    if (over === null) return;
    if (active.id === over.id) return;

    const activeIndex = columns.findIndex((column) => column.id === active.id);
    const overIndex = columns.findIndex((column) => column.id === over.id);

    setColumns(arrayMove(columns, activeIndex, overIndex));
  }

  const parentOnChange = useCallback(
    (newColumn: LayoutColumn) => {
      const columnIndex = columns.findIndex((col) => col.id === newColumn.id);
      if (columns[columnIndex] !== newColumn) {
        const newColumns = [...columns];
        newColumns[columnIndex] = newColumn;
        setColumns(newColumns);
      }
    },
    [columns],
  );

  function onDragStart(event: DragStartEvent): void {
    if (event.active.data.current !== undefined) {
      setActive(columns.find((col) => col.id === event.active.id) ?? null);
    }
  }

  const removeColumn = (id: number): void => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const save = (): void => {
    if (columns !== null) saveLayout(columns);
  };

  const loadingState = Array.from({ length: 2 }).map((_, i) => (
    <QueryLoading isLoading={isLoading} key={i}>
      <article className='rounded-md w-[425px] h-[360px] p-3 m-2 bg-white shadow-statusCard' />
    </QueryLoading>
  ));

  const errorState = (
    <article className='rounded-md w-[425px] h-[360px] p-3 m-2 bg-white shadow-statusCard relative'>
      <QueryError className='grid place-content-center' title='Error: Could not load layout columns' />
    </article>
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={columnIds}>
        <Row>
          {isLoading ?
            loadingState
          : isError ?
            errorState
          : columns.map((column) => (
              <Col key={column.id}>
                <ConfigLayoutColumn column={column} remove={removeColumn} parentOnChange={parentOnChange} />
              </Col>
            ))
          }
        </Row>
        <Row>
          <Button type='dashed' onClick={addColumn} block icon={<PlusOutlined />} className='bg-white'>
            Add Column
          </Button>
        </Row>
      </SortableContext>
      <Button className='mt-2 bg-white' onClick={save}>
        Save
      </Button>
      {createPortal(
        <DragOverlay>{active !== null && <ConfigLayoutColumn column={active} />}</DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default LayoutConfigurator;
