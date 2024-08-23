'use client';

import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { type InferOutput, minLength, object, pipe, string, trim } from 'valibot';

import { deleteLearningGoal, patchLearningGoal, postGoalRequirement } from '@/api/entry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useActionStatus } from '@/hooks/use-action-status';
import { type LearningGoal, LogicalExpression } from '@/types/tile';

import { GoalRequirementCard } from './goal-requirements-card';

const LearningGoalSchema = object({
  title: pipe(string('The title must be a string.'), trim(), minLength(1, 'The title must have 1 character or more.')),
});

export function LearningGoalCard({ goal }: { goal: LearningGoal }): ReactElement {
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

  const form = useForm<InferOutput<typeof LearningGoalSchema>>({
    resolver: valibotResolver(LearningGoalSchema),
    defaultValues: {
      title: goal.title,
    },
  });

  const {
    mutate: patchGoal,
    status: patchGoalStatus,
    isPending: patchGoalPending,
  } = useMutation({
    mutationFn: patchLearningGoal,
  });

  const pathGoalDescription = useMemo(
    () => ({
      error: 'Failed to add learning goal',
      success: 'Learning goal added successfully',
    }),
    [],
  );

  useActionStatus({
    description: pathGoalDescription,
    status: patchGoalStatus,
  });

  function onSubmit(values: InferOutput<typeof LearningGoalSchema>): void {
    patchGoal({ ...goal, title: values.title });

    if (patchGoalStatus === 'success') setIsEditing(false);
  }

  const {
    mutate: removeGoal,
    status: removeGoalStatus,
    isPending: removeGoalPending,
  } = useMutation({
    mutationFn: deleteLearningGoal,
  });

  const removeGoalDescription = useMemo(
    () => ({
      error: 'Failed to remove learning goal',
      success: 'Learning goal removed successfully',
    }),
    [],
  );

  useActionStatus({
    description: removeGoalDescription,
    status: removeGoalStatus,
  });

  const {
    mutate: postRequirement,
    status: postRequirementStatus,
    isPending: postRequirementPending,
  } = useMutation({
    mutationFn: postGoalRequirement,
  });

  const postRequirementDescription = useMemo(
    () => ({
      error: 'Failed to add requirement',
      success: 'Requirement added successfully',
    }),
    [],
  );

  useActionStatus({
    description: postRequirementDescription,
    status: postRequirementStatus,
  });

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          {isEditing ?
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
                <Button disabled={patchGoalPending} type='submit'>
                  Save
                </Button>
              </form>
            </Form>
          : <Button
              className='!px-0 text-lg font-semibold leading-none tracking-tight'
              onClick={() => {
                setIsEditing(true);
              }}
              variant='ghost'
            >
              {goal.title}
            </Button>
          }
          <Button
            disabled={removeGoalPending}
            onClick={() => {
              removeGoal(goal.id);
            }}
            size='icon'
            variant='ghost'
          >
            <Trash2 className='stroke-destructive' />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {goal.requirements.map((requirement) => (
          <GoalRequirementCard key={requirement.goal_id} requirement={requirement} />
        ))}
      </CardContent>
      <CardFooter>
        <Button
          disabled={postRequirementPending}
          onClick={() => {
            postRequirement({
              id: -1,
              goal_id: goal.id,
              assignment_id: -1,
              value: 55,
              expression: LogicalExpression.GreaterEqual,
            });
          }}
          variant='secondary'
        >
          Add Requirement
        </Button>
      </CardFooter>
    </Card>
  );
}
