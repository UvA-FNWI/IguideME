'use client';

import { type ReactElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

import { LayoutForm } from '@/app/courses/[courseId]/admin/layout/_components/layout-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/cn';
import type { LayoutColumn } from '@/types/layout';

interface DndLayoutColumnProps {
  isOverlay?: boolean;
  layoutColumn: LayoutColumn;

  changeColumn: (column: LayoutColumn) => void;
  removeColumn: (columnId: number) => void;
}

function DndLayoutColumn({ isOverlay, layoutColumn, changeColumn, removeColumn }: DndLayoutColumnProps): ReactElement {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `layoutColumn-${String(layoutColumn.id)}`,
    data: {
      type: 'LayoutColumn',
      layoutColumn,
    },
    attributes: {
      roleDescription: `Column: ${String(layoutColumn.id)}`,
    },
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        isOverlay ? 'ring-2 ring-primary'
        : isDragging ? 'opacity-30 ring-2'
        : undefined,
        'w-full max-w-md',
      )}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <CardHeader className='flex flex-row items-center justify-between border-b-2 p-4 text-left font-semibold'>
        <div className='flex items-center justify-center gap-1'>
          <Button
            variant='ghost'
            {...attributes}
            {...listeners}
            className='relative -ml-2 h-auto cursor-grab p-1 text-primary/50'
          >
            <span className='sr-only'>{`Move column: ${String(layoutColumn.id)}`}</span>
            <GripVertical />
          </Button>
          <CardTitle>Column {layoutColumn.id}</CardTitle>
        </div>
        <Button
          className='!m-0'
          onClick={() => {
            removeColumn(layoutColumn.id);
          }}
          size='icon'
          variant='ghost'
        >
          <Trash2 className='stroke-destructive' />
        </Button>
      </CardHeader>
      <ScrollArea className='[&>div>div]:!block'>
        <CardContent className='p-2'>
          <LayoutForm column={layoutColumn} changeColumn={changeColumn} />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export { DndLayoutColumn };
