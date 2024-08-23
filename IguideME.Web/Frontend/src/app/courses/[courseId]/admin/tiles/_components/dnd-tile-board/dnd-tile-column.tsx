'use client';

import { type ReactElement, type ReactNode, useMemo } from 'react';
import { type UniqueIdentifier, useDndContext } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation } from '@tanstack/react-query';
import { GripVertical, Trash2 } from 'lucide-react';

import { deleteTileGroup } from '@/api/tiles';
import { EditGroupTitle } from '@/app/courses/[courseId]/admin/tiles/_components/edit-group-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useActionStatus } from '@/hooks/use-action-status';
import { cn } from '@/lib/cn';
import type { Tile, TileGroup } from '@/types/tile';

import { AddTileItem, DndTileItem } from './dnd-tile-item';

function DndTileColumnWrapper({ children }: { children: ReactNode }): ReactElement {
  const dndContext = useDndContext();

  return (
    <ScrollArea className={dndContext.active ? 'snap-none' : 'snap-x snap-mandatory'}>
      <div className='flex flex-col gap-4'>{children}</div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}

interface DndTileColumnProps {
  tileGroup: TileGroup;
  tiles: Tile[];
  isOverlay?: boolean;
}

function DndTileColumn({ tileGroup, tiles, isOverlay }: DndTileColumnProps): ReactElement {
  const tileIds = useMemo(() => tiles.map((tile) => `tile-${String(tile.id)}`), [tiles]) as UniqueIdentifier[];

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `tileGroup-${String(tileGroup.id)}`,
    data: {
      type: 'TileGroup',
      tileGroup,
    },
    attributes: {
      roleDescription: `Tile group: ${String(tileGroup.title)}`,
    },
  });

  const { mutate, status, isPending } = useMutation({
    mutationFn: deleteTileGroup,
  });

  const description = useMemo(
    () => ({
      error: 'Failed to delete tile group',
      success: 'Tile group deleted',
    }),
    [],
  );

  useActionStatus({
    description,
    status,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        isOverlay ? 'ring-2 ring-primary'
        : isDragging ? 'opacity-30 ring-2'
        : undefined,
        'w-full',
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
            <span className='sr-only'>{`Move column: ${String(tileGroup.title)}`}</span>
            <GripVertical />
          </Button>
          <EditGroupTitle tileGroup={tileGroup} />
        </div>
        <Button
          className='!m-0'
          disabled={isPending}
          onClick={() => {
            mutate(tileGroup.id);
          }}
          size='icon'
          variant='ghost'
        >
          <Trash2 className='stroke-destructive' />
        </Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className='flex flex-grow flex-wrap gap-2 p-2'>
          <SortableContext items={tileIds}>
            {tiles.map((tile) => (
              <DndTileItem key={`item-${String(tile.id)}`} tile={tile} />
            ))}
          </SortableContext>
          <AddTileItem amountOfTiles={tiles.length + 1} groupId={tileGroup.id} />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export { DndTileColumn, DndTileColumnWrapper };
