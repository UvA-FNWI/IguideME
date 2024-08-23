'use client';

import { type FC, memo, type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation } from '@tanstack/react-query';
import { type InferOutput, minLength, object, pipe, string, trim } from 'valibot';

import { patchTileGroup } from '@/api/tiles';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useActionStatus } from '@/hooks/use-action-status';
import type { TileGroup } from '@/types/tile';

interface EditGroupTitleFormState {
  groupId: number;
  groupPosition: number;

  errors: {
    expected: string;
    kind: string;
    message: string;
    received: string;
    type: string;
  }[];
}

const editGroupTitleSchema = object({
  title: pipe(string('The title must be a string.'), trim(), minLength(1, 'The title must have 1 character or more.')),
});

const EditGroupTitle: FC<{ tileGroup: TileGroup }> = memo(({ tileGroup }): ReactElement => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const form = useForm<InferOutput<typeof editGroupTitleSchema>>({
    resolver: valibotResolver(editGroupTitleSchema),
    defaultValues: {
      title: tileGroup.title,
    },
  });

  const { mutate, isPending, status } = useMutation({ mutationFn: patchTileGroup });

  const description = useMemo(
    () => ({
      error: 'Failed to update the group title.',
      success: 'Group title updated.',
    }),
    [],
  );

  useActionStatus({
    description,
    status,
  });

  function onSubmit(values: InferOutput<typeof editGroupTitleSchema>): void {
    mutate({
      id: tileGroup.id,
      title: values.title,
      position: tileGroup.position,
    });

    if (status === 'success') setIsEditing(false);
  }

  return isEditing ?
      <Form {...form}>
        <form className='flex items-center gap-4' ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>Tile group title</FormLabel>
                <FormControl>
                  <Input className='!m-0' required type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type='submit'>
            Save
          </Button>
        </form>
      </Form>
    : <Button
        className='text-lg font-semibold leading-none tracking-tight'
        onClick={() => {
          setIsEditing(true);
        }}
        variant='ghost'
      >
        {tileGroup.title}
      </Button>;
});
EditGroupTitle.displayName = 'EditGroupTitle';

export type { EditGroupTitleFormState };
export { EditGroupTitle };
