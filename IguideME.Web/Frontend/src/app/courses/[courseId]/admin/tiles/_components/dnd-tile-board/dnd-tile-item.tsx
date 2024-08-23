'use client';

import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation } from '@tanstack/react-query';
import { GripVertical, Plus } from 'lucide-react';

import { postTile } from '@/api/tiles';
import { DndTileItemEditWrapper } from '@/app/courses/[courseId]/admin/tiles/_components/edit-tile/dnd-tile-item-edit-wrapper';
import {
  TileActionButtons,
  TileGrading,
  TileTypeBadge,
} from '@/app/courses/[courseId]/admin/tiles/_components/tile-item-parts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useActionStatus } from '@/hooks/use-action-status';
import { cn } from '@/lib/cn';
import { GradingType, type Tile, TileType } from '@/types/tile';

import { TileTypeProvider } from './tile-type-store';

interface DndItemProps {
  tile: Tile;
  isOverlay?: boolean;
}

function DndTileItem({ tile, isOverlay }: DndItemProps): ReactElement {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `tile-${String(tile.id)}`,
    data: {
      type: 'Tile',
      tile,
    },
    attributes: {
      roleDescription: 'Tile',
    },
  });

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const opOpenChange = useCallback(() => {
    if (hasChanged && isSheetOpen) {
      setOpenAlert(true);
    } else {
      setIsSheetOpen((prev) => !prev);
    }
  }, [hasChanged, isSheetOpen]);

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={opOpenChange}>
        <SheetTrigger asChild>
          <Card
            ref={setNodeRef}
            className={cn(
              isOverlay ? 'ring-2 ring-primary'
              : isDragging ? 'opacity-30 ring-2'
              : undefined,
              'h-[200px] w-full min-w-[240px] cursor-pointer sm:w-auto',
            )}
            style={{
              transition,
              transform: CSS.Translate.toString(transform),
            }}
          >
            <CardHeader className='flex flex-row items-center justify-between gap-10'>
              <div className='flex min-h-10 items-center justify-center gap-1'>
                <Button
                  variant='ghost'
                  {...attributes}
                  {...listeners}
                  className='-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50'
                >
                  <span className='sr-only'>Move item</span>
                  <GripVertical />
                </Button>
                <span>{String(tile.title)}</span>
              </div>
              <TileActionButtons tile={tile} />
            </CardHeader>
            <CardContent>
              <TileTypeBadge type={tile.type} />
            </CardContent>
            <CardFooter>
              <TileGrading gradingType={tile.gradingType} tileType={tile.type} weight={tile.weight} />
            </CardFooter>
          </Card>
        </SheetTrigger>
        <TileTypeProvider tileType={tile.type}>
          <DndTileItemEditWrapper setHasChanged={setHasChanged} setIsSheetOpen={setIsSheetOpen} tile={tile} />
        </TileTypeProvider>
      </Sheet>
      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Closing this dialog will discard your changes. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsSheetOpen(true);
                setOpenAlert(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsSheetOpen(false);
                setOpenAlert(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface AddTileItemProps {
  amountOfTiles: number;
  groupId: number;
}

function AddTileItem({ amountOfTiles, groupId }: AddTileItemProps): ReactElement {
  const { mutate, status, isPending } = useMutation({ mutationFn: postTile });

  const description = useMemo(
    () => ({
      error: `Tile could not be added.`,
      success: `Tile has been successfully added.`,
    }),
    [],
  );

  useActionStatus({
    description,
    status,
  });

  return (
    <Card>
      <CardContent className='!p-0'>
        <Button
          className='flex h-[200px] w-[240px] gap-1'
          disabled={isPending}
          onClick={() => {
            mutate({
              id: -1,
              group_id: groupId,
              title: 'Title',
              weight: 0,
              position: amountOfTiles,
              type: TileType.Assignments,
              visible: false,
              notifications: false,
              gradingType: GradingType.Percentage,
              entries: [],
              alt: false,
            });
          }}
          variant='ghost'
        >
          <Plus className='size-5' />
          <span>Add new tile</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export { AddTileItem, DndTileItem };
