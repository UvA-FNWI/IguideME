'use client';

import { type Dispatch, type ReactElement, type SetStateAction, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation } from '@tanstack/react-query';
import {
  any,
  boolean,
  enum as vEnum,
  type InferOutput,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
  trim,
} from 'valibot';
import { useShallow } from 'zustand/react/shallow';

import { patchTile } from '@/api/tiles';
import { useTileTypeContext } from '@/app/courses/[courseId]/admin/tiles/_components/dnd-tile-board/tile-type-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useActionStatus } from '@/hooks/use-action-status';
import { GradingType, type Tile, type TileEntry, TileType } from '@/types/tile';

import { SelectAssignments } from './select-assignments';

const EditAssignmentSchema = object({
  title: pipe(string('The title must be a string.'), trim(), minLength(1, 'The title must have 1 character or more.')),
  notifications: boolean('Please specify whether notifications are enabled or disabled.'),
  visible: boolean('Please specify whether the item is visible or hidden.'),
  itemType: vEnum(TileType, 'Please specify the type of the item.'),
  gradingType: vEnum(GradingType, 'Please specify the grading type.'),
  weight: pipe(
    number('The weight must be a number.'),
    minValue(0, 'The weight must be 0 or more.'),
    maxValue(1, 'The weight must be 1 or less.'),
  ),
  // TODO: Add validation for entries
  entries: any(),
});

export function EditAssignmentTile({
  setHasChanged,
  setIsSheetOpen,
  tile,
}: {
  setHasChanged: Dispatch<SetStateAction<boolean>>;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  tile: Tile;
}): ReactElement {
  const { tileType, setTileType } = useTileTypeContext(
    useShallow((state) => ({ tileType: state.tileType, setTileType: state.setTileType })),
  );

  const form = useForm<InferOutput<typeof EditAssignmentSchema>>({
    resolver: valibotResolver(EditAssignmentSchema),
    defaultValues: {
      title: tile.title,
      notifications: tile.notifications,
      visible: tile.visible,
      itemType: tileType,
      gradingType: tile.gradingType,
      weight: tile.weight,
      entries: tile.entries,
    },
  });

  const { mutate, status, isPending } = useMutation({
    mutationFn: patchTile,
  });

  const description = useMemo(
    () => ({
      error: 'Tile could not be saved.',
      success: 'Tile has been successfully saved.',
    }),
    [],
  );

  useActionStatus({
    description,
    status,
  });

  function onSubmit(data: InferOutput<typeof EditAssignmentSchema>): void {
    data.gradingType =
      data.itemType === TileType.Discussions ? GradingType.NotGraded
      : data.itemType === TileType.LearningOutcomes ? GradingType.Points
      : data.gradingType;

    mutate({ ...tile, ...data });
    setHasChanged(false);
  }

  useEffect(() => {
    setHasChanged(form.formState.isDirty);

    if (form.formState.dirtyFields.itemType) {
      setTileType(form.getValues().itemType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to run this effect when the form state changes
  }, [form.formState.isDirty, form.formState.dirtyFields.itemType]);

  return (
    <SheetContent className='flex min-w-[100%] flex-col sm:min-w-[90%] md:min-w-[40%] lg:min-w-max'>
      <ScrollArea className='flex-grow [&>div>div]:!block'>
        <SheetHeader>
          <SheetTitle>Editing &quot;{tile.title}&quot;</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form className='mx-1 mt-8 space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='max-w-80'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='notifications'
                render={({ field }) => (
                  <FormItem className='justify-left flex items-center gap-4'>
                    <FormLabel className='w-40'>Enable notifications</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='visible'
                render={({ field }) => (
                  <FormItem className='justify-left flex items-center gap-4'>
                    <FormLabel className='w-40'>Make visible to students</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-wrap gap-4'>
              <FormField
                control={form.control}
                name='itemType'
                render={({ field }) => (
                  <FormItem className='flex-1 flex-grow'>
                    <FormLabel>Tile type</FormLabel>
                    <Select
                      defaultValue={String(field.value)}
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className='max-w-80'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={String(TileType.Assignments)}>Assignments</SelectItem>
                        <SelectItem value={String(TileType.Discussions)}>Discussions</SelectItem>
                        <SelectItem value={String(TileType.LearningOutcomes)}>Learning Outcomes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gradingType'
                render={({ field }) => (
                  <FormItem className='flex-1 flex-grow'>
                    <FormLabel>Grading type</FormLabel>
                    <Select
                      defaultValue={String(field.value)}
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className='max-w-80'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={String(GradingType.Letters)}>Letters</SelectItem>
                        <SelectItem value={String(GradingType.NotGraded)}>Not graded</SelectItem>
                        <SelectItem value={String(GradingType.PassFail)}>Pass/Fail</SelectItem>
                        <SelectItem value={String(GradingType.Percentage)}>Percentage</SelectItem>
                        <SelectItem value={String(GradingType.Points)}>Points</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='weight'
              render={({ field }) => (
                <FormItem className='max-w-80'>
                  <FormLabel>Weight (%)</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(value) => {
                        field.onChange(Number(value) / 100);
                      }}
                      value={field.value * 100}
                      min={0}
                      max={100}
                      type='number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='entries'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add assignments to the tile</FormLabel>
                  <SelectAssignments entries={field.value as TileEntry[]} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <Button className='w-20' disabled={isPending} type='submit'>
                Save
              </Button>
              <Button
                className='w-20'
                disabled={isPending}
                onClick={() => {
                  setHasChanged(false);
                  setIsSheetOpen(false);
                }}
                type='button'
                variant='secondary'
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </SheetContent>
  );
}
