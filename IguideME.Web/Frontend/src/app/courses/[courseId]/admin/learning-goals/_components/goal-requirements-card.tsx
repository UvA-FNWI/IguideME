'use client';

import { type ReactElement, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { enum_, type InferOutput, maxValue, minValue, number, object, pipe } from 'valibot';

import { deleteRequirement, getAssignments, patchGoalRequirement } from '@/api/entry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActionStatus } from '@/hooks/use-action-status';
import { type Assignment, type GoalRequirement, LogicalExpression } from '@/types/tile';

const requirementSchema = object({
  assignment_id: number('The assignment id must be a number.'),
  expression: enum_(LogicalExpression, 'The expression must be a valid logical expression.'),
  value: pipe(
    number('The value must be a number.'),
    minValue(1, 'The value must be greater than 0.'),
    maxValue(10, 'The value must be less than 10.'),
  ),
});

export function GoalRequirementCard({ requirement }: { requirement: GoalRequirement }): ReactElement {
  const {
    data: assignments,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  const {
    mutate: saveRequirement,
    status: saveStatus,
    isPending: savePending,
  } = useMutation({
    mutationFn: patchGoalRequirement,
  });

  const saveDescription = useMemo(
    () => ({
      error: 'Failed to save requirement',
      success: 'Requirement saved successfully',
    }),
    [],
  );

  useActionStatus({
    description: saveDescription,
    status: saveStatus,
  });

  const {
    mutate: removeRequirement,
    status: deleteStatus,
    isPending: deletePending,
  } = useMutation({
    mutationFn: deleteRequirement,
  });

  const deleteDescription = useMemo(
    () => ({
      error: 'Failed to delete requirement',
      success: 'Requirement deleted successfully',
    }),
    [],
  );

  useActionStatus({
    description: deleteDescription,
    status: deleteStatus,
  });

  const form = useForm<InferOutput<typeof requirementSchema>>({
    resolver: valibotResolver(requirementSchema),
    defaultValues: {
      assignment_id: requirement.assignment_id,
      expression: requirement.expression,
      value: requirement.value,
    },
  });

  function onSubmit(values: InferOutput<typeof requirementSchema>): void {
    saveRequirement({ ...requirement, ...values });
  }

  return (
    <Card>
      <CardContent className='flex items-center justify-between !p-3'>
        <Form {...form}>
          <form className='flex items-center gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='assignment_id'
              render={({ field }) => (
                <FormItem className='w-80'>
                  <FormLabel className='sr-only'>Tile group title</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                      }}
                    >
                      <SelectTrigger className='!m-0' disabled={isError || isLoading}>
                        <SelectValue
                          placeholder={
                            isError ? 'Failed to load assignments'
                            : isLoading ?
                              'Loading assignments...'
                            : 'Select an assignment'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Assignments</SelectLabel>
                          {assignments ?
                            Array.from(assignments.values()).map((assignment: Assignment) => (
                              <SelectItem key={assignment.id} value={String(assignment.id)}>
                                {assignment.title}
                              </SelectItem>
                            ))
                          : null}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='expression'
              render={({ field }) => (
                <FormItem className='w-full max-w-20'>
                  <FormLabel className='sr-only'>Tile group title</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <SelectTrigger className='!m-0'>
                        <SelectValue placeholder='Select an expression' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Expressions</SelectLabel>
                          {[
                            {
                              value: LogicalExpression.Equal,
                              label: '=',
                            },
                            {
                              value: LogicalExpression.Greater,
                              label: '>',
                            },
                            {
                              value: LogicalExpression.GreaterEqual,
                              label: '≥',
                            },
                            {
                              value: LogicalExpression.Less,
                              label: '<',
                            },
                            {
                              value: LogicalExpression.LessEqual,
                              label: '≤',
                            },
                            {
                              value: LogicalExpression.NotEqual,
                              label: '≠',
                            },
                          ].map((expression) => (
                            <SelectItem key={expression.value} value={String(expression.value)}>
                              {expression.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem className='w-full max-w-20'>
                  <FormLabel className='sr-only'>Tile group title</FormLabel>
                  <FormControl>
                    <Input {...field} className='!m-0' required type='number' min={1} max={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={savePending} type='submit'>
              Save
            </Button>
          </form>
          <Button
            disabled={deletePending}
            onClick={() => {
              removeRequirement(requirement.id);
            }}
            size='icon'
            variant='ghost'
          >
            <Trash2 className='stroke-destructive' />
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
