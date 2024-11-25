import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { App, Button } from 'antd';
import { createPortal } from 'react-dom';
import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement, useEffect, useMemo, useState } from 'react';
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
import Column from './Column';

const LayoutConfigurator: FC = (): ReactElement => {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['layout-columns'],
    queryFn: getLayoutColumns,
  });

  const { message } = App.useApp();
  const { mutate: saveLayout } = useMutation({
    mutationFn: postLayoutColumns,

    onMutate: async () => {
      void message.open({
        key: 'layout',
        type: 'loading',
        content: 'Saving layout...',
      });
    },

    onError: () => {
      void message.open({
        key: 'layout',
        type: 'error',
        content: 'Error saving layout',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['layout-columns'] });

      void message.open({
        key: 'layout',
        type: 'success',
        content: 'Layout saved successfully',
        duration: 3,
      });
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
        distance: 5,
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

  function onDragStart(event: DragStartEvent): void {
    if (event.active.data.current !== undefined) {
      setActive(columns.find((col) => col.id === event.active.id) ?? null);
    }
  }

  function onDragEnd(event: DragEndEvent): void {
    setActive(null);
    const { active, over } = event;
    if (over === null) return;
    if (active.id === over.id) return;

    const activeIndex = columns.findIndex((column) => column.id === active.id);
    const overIndex = columns.findIndex((column) => column.id === over.id);

    setColumns(arrayMove(columns, activeIndex, overIndex));
  }

  const removeColumn = (id: number): void => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const handleSettingChange = (column: LayoutColumn): void => {
    const index = columns.findIndex((col) => col.id === column.id);
    columns[index] = column;
    setColumns([...columns]);
  };

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={columnIds}>
        <div className='space-y-8'>
          <div className='flex flex-wrap gap-8 overflow-x-auto'>
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                isLoading={isLoading}
                isError={isError}
                handleSettingChange={handleSettingChange}
                removeColumn={removeColumn}
              />
            ))}
          </div>
          <Button
            onClick={addColumn}
            block
            icon={<PlusOutlined />}
            className='border-dashed bg-surface1 hover:!border-solid hover:!border-border1 hover:!bg-accent/50 [&_span]:!text-text'
          >
            Add Column
          </Button>
        </div>
      </SortableContext>
      <Button
        className='mt-2 min-w-20 !border-none bg-success hover:!border-none hover:!bg-success/80 [&_span]:text-text'
        onClick={() => {
          saveLayout(columns);
        }}
      >
        Save
      </Button>
      {createPortal(
        <DragOverlay>
          {active !== null && (
            <Column
              column={active}
              isLoading={isLoading}
              isError={isError}
              handleSettingChange={handleSettingChange}
              removeColumn={removeColumn}
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default LayoutConfigurator;
