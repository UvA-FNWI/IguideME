'use client';

import { type ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  type Active,
  type Announcements,
  type DataRef,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  type Over,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { postLayoutColumns } from '@/api/layout';
import { coordinateGetter } from '@/app/courses/[courseId]/admin/tiles/_components/dnd-tile-board/multiple-containers-keyboard-preset';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useActionStatus } from '@/hooks/use-action-status';
import { useWarnIfUnsavedChanges } from '@/hooks/use-warn-if-unsaved-changes';
import type { LayoutColumn } from '@/types/layout';

import { DndLayoutColumn } from './dnd-layout-column';

interface DndTileBoardProps {
  layoutColumnData: LayoutColumn[];
}

export function DndLayoutBoard({ layoutColumnData }: DndTileBoardProps): ReactElement {
  interface LayoutColumnDragData {
    type: 'LayoutColumn';
    layoutColumn: LayoutColumn;
  }

  const [activeLayoutColumn, setActiveLayoutColumn] = useState<LayoutColumn | null>(null);
  const [layoutColumns, setLayoutColumns] = useState<LayoutColumn[]>(layoutColumnData);
  const layoutColumnIds = useMemo(() => layoutColumns.map((col) => `LayoutColumn-${String(col.id)}`), [layoutColumns]);
  const pickedUpLayoutColumn = useRef<number | null>(null);

  function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined,
  ): entry is T & { data: DataRef<LayoutColumnDragData> } {
    return Boolean(entry && entry.data.current?.type === 'LayoutColumn');
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;

      if (active.data.current?.type === 'LayoutColumn') {
        const startLayoutColumnIdx = layoutColumnIds.findIndex((id) => id === active.id);
        const startLayoutColumn = layoutColumns[startLayoutColumnIdx];
        return `Picked up column ${String(startLayoutColumn?.id)} at position: ${String(startLayoutColumnIdx + 1)} of ${String(layoutColumnIds.length)}`;
      }
    },

    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (active.data.current?.type === 'LayoutColumn' && over.data.current?.type === 'LayoutColumn') {
        const overLayoutColumnIdx = layoutColumnIds.findIndex((id) => id === over.id);
        return `Column ${String(active.data.current.layoutColumn.id)} was moved over ${String(
          over.data.current.layoutColumn.id,
        )} at position ${String(overLayoutColumnIdx + 1)} of ${String(layoutColumnIds.length)}`;
      }
    },

    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpLayoutColumn.current = null;
        return;
      }

      if (active.data.current?.type === 'LayoutColumn' && over.data.current?.type === 'LayoutColumn') {
        const overLayoutColumnPosition = layoutColumnIds.findIndex((id) => id === over.id);

        return `Column ${String(active.data.current.layoutColumn.id)} was dropped into position ${String(overLayoutColumnPosition + 1)} of ${String(
          layoutColumnIds.length,
        )}`;
      }

      pickedUpLayoutColumn.current = null;
    },

    onDragCancel({ active }) {
      pickedUpLayoutColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${String(active.data.current?.type)} cancelled.`;
    },
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  const [changes, setChanges] = useState<boolean>(false);
  useWarnIfUnsavedChanges(changes);

  const {
    mutate: saveLayout,
    status,
    isPending,
  } = useMutation({
    mutationFn: postLayoutColumns,
  });

  const description = useMemo(() => {
    return {
      error: `Layout changes could not be saved.`,
      success: `Layout changes have been successfully saved.`,
    };
  }, []);

  useActionStatus({
    description,
    status,
  });

  const { toast } = useToast();
  const onLayoutSave = useCallback(() => {
    // Check if the total width of the columns is set to 100% or less.
    if (layoutColumns.reduce((acc, col) => acc + col.width, 0) > 100) {
      toast({
        title: 'Failed to save layout',
        description: 'The total width of the columns must be 100% or less.',
        variant: 'destructive',
      });
    } else {
      setChanges(false);
      saveLayout(layoutColumns);
    }
  }, [layoutColumns, saveLayout, toast]);

  const changeLayoutColumn = useCallback((column: LayoutColumn) => {
    setChanges(true);
    setLayoutColumns((cols) => cols.map((col) => (col.id === column.id ? column : col)));
  }, []);

  const removeLayoutColumn = useCallback((columnId: number) => {
    setChanges(true);
    setLayoutColumns((cols) => cols.filter((col) => col.id !== columnId));
  }, []);

  return (
    <>
      <div className='mb-4 flex w-full flex-wrap justify-end gap-2'>
        <Button
          className='flex w-44 gap-1 truncate'
          onClick={() => {
            setLayoutColumns((cols) => {
              const newLayoutColumn = {
                id: Math.max(...cols.map((col) => col.id)) + 1,
                width: 1,
                position: cols.length,
                groups: [],
              };

              setChanges(true);
              return [...cols, newLayoutColumn];
            });
          }}
          variant='secondary'
        >
          <Plus />
          <span>Add new column</span>
        </Button>
        <Button className='w-44' disabled={!changes || isPending} onClick={onLayoutSave} type='submit'>
          Save layout changes
        </Button>
      </div>
      <DndContext
        accessibility={{ announcements }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={layoutColumnIds}>
          <div className='flex flex-wrap gap-8'>
            {layoutColumns.map((col) => (
              <DndLayoutColumn
                layoutColumn={col}
                key={`TileGroup-${String(col.id)}`}
                changeColumn={changeLayoutColumn}
                removeColumn={removeLayoutColumn}
              />
            ))}
          </div>
        </SortableContext>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {activeLayoutColumn ?
                <DndLayoutColumn
                  layoutColumn={activeLayoutColumn}
                  changeColumn={changeLayoutColumn}
                  removeColumn={removeLayoutColumn}
                />
              : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </>
  );

  function handleDragStart(event: DragStartEvent): void {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;

    if (data?.type === 'LayoutColumn') setActiveLayoutColumn(data.layoutColumn);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveLayoutColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    if (activeId === overId) return;
    setChanges(true);

    if (activeData?.type === 'LayoutColumn') {
      setLayoutColumns((cols) => {
        const activeLayoutColumnIndex = cols.findIndex((col) => String(col.id) === (activeId as string).split('-')[1]);
        const overLayoutColumnIndex = cols.findIndex((col) => String(col.id) === (overId as string).split('-')[1]);
        return arrayMove(cols, activeLayoutColumnIndex, overLayoutColumnIndex);
      });
    }
  }
}
