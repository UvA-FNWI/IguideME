'use client';

import { type ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useQuery } from '@tanstack/react-query';
import { array, type InferOutput, maxValue, minValue, number, object, pipe } from 'valibot';

import { getTileGroups } from '@/api/tiles';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Transferlist, type TransferlistItem } from '@/components/ui/transferlist';
import { useToast } from '@/components/ui/use-toast';
import type { LayoutColumn } from '@/types/layout';

const LayoutColumnSchema = object({
  width: pipe(
    number('Please enter a valid number'),
    minValue(1, 'Width must be at least 1%'),
    maxValue(100, 'Width must be at most 100%'),
  ),
  tileGroups: array(number('Please enter a valid number'), 'Tile groups must be an array of numbers'),
});

export function LayoutForm({
  column,
  changeColumn,
}: {
  column: LayoutColumn;
  changeColumn: (column: LayoutColumn) => void;
}): ReactElement {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['tile-groups'],
    queryFn: getTileGroups,
  });

  const form = useForm<InferOutput<typeof LayoutColumnSchema>>({
    resolver: valibotResolver(LayoutColumnSchema),
    defaultValues: {
      width: column.width,
      tileGroups: column.groups,
    },
  });

  const { toast } = useToast();
  function onSubmit(values: InferOutput<typeof LayoutColumnSchema>): void {
    changeColumn({ ...column, ...values });

    // TODO: Add success state
    toast({
      title: 'Column saved',
      variant: 'success',
    });
  }

  const [selectedGroups, setSelectedGroups] = useState<TransferlistItem[]>([]);
  const [unSelectedGroups, setUnSelectedGroups] = useState<TransferlistItem[]>([]);

  useEffect(() => {
    if (data) {
      setSelectedGroups(
        data
          .filter((group) => column.groups.includes(group.id))
          .map((group) => ({ id: String(group.id), label: group.title }) as TransferlistItem),
      );
      setUnSelectedGroups(
        data
          .filter((group) => !column.groups.includes(group.id))
          .map((group) => ({ id: String(group.id), label: group.title }) as TransferlistItem),
      );
    }
  }, [column.groups, data]);

  // TODO: Add loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error loading tile groups</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='width'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Width (%)</FormLabel>
              <FormControl>
                <div className='!m-0 flex w-full flex-grow flex-wrap'>
                  <Slider className='mx-3 min-w-56 flex-1 flex-grow' value={[field.value]} onChange={field.onChange} />
                  <Input {...field} className='w-20 flex-shrink-0' type='number' min={1} max={100} step={1} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tileGroups'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Tile groups</FormLabel>
              <FormControl>
                <Transferlist
                  initialLeftItems={unSelectedGroups}
                  initialRightItems={selectedGroups}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-4 w-20' type='submit'>
          Save
        </Button>
      </form>
    </Form>
  );
}
