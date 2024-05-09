import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { PlusOutlined } from '@ant-design/icons';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { useTheme } from 'next-themes';
import { type FC, type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

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

  const { mutate: saveLayout, status } = useMutation({
    mutationFn: postLayoutColumns,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['layout-columns'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Layout saved successfully', {
        closeButton: true,
      });
    } else if (status === 'error') {
      toast.error('Error saving layout', {
        closeButton: true,
      });
    }
  }, [status]);

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

  const { theme } = useTheme();
  const loadingState = Array.from({ length: 2 }).map((_, i) => (
    <QueryLoading isLoading={isLoading} key={i}>
      <article
        className={`m-2 h-[360px] w-[425px] rounded-md bg-card p-3 ${theme === 'light' ? 'shadow-statusCard' : ''}`}
      />
    </QueryLoading>
  ));

  const errorState = (
    <article
      className={`m-2 h-[360px] w-[425px] rounded-md bg-card p-3 ${theme === 'light' ? 'shadow-statusCard' : ''} relative`}
    >
      <QueryError className='grid place-content-center' title='Error: Could not load layout columns' />
    </article>
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={columnIds}>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-wrap gap-2 overflow-x-auto'>
            {isLoading ?
              loadingState
            : isError ?
              errorState
            : columns.map((column) => (
                <div className='min-w-fit' key={column.id}>
                  <ConfigLayoutColumn column={column} remove={removeColumn} parentOnChange={parentOnChange} />
                </div>
              ))
            }
          </div>
          <Button
            type='dashed'
            onClick={addColumn}
            block
            icon={<PlusOutlined />}
            className='bg-card hover:!border-primary hover:!bg-dropdownBackground [&_span]:!text-text'
          >
            Add Column
          </Button>
        </div>
      </SortableContext>
      <Button
        className='mt-2 min-w-20 !border-none bg-button hover:!border-none hover:!bg-button-hover [&_span]:text-text'
        onClick={save}
      >
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
