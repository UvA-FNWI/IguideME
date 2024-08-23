'use client';

import { type ReactElement, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { postLearningGoal } from '@/api/entry';
import { Button } from '@/components/ui/button';
import { useActionStatus } from '@/hooks/use-action-status';

export function AddLearningGoal(): ReactElement {
  const {
    mutate: postGoal,
    status,
    isPending,
  } = useMutation({
    mutationFn: postLearningGoal,
  });

  const description = useMemo(
    () => ({
      error: 'Failed to add learning goal',
      success: 'Learning goal added successfully',
    }),
    [],
  );

  useActionStatus({
    description,
    status,
  });

  const clickHandler = useCallback(() => {
    postGoal({
      id: -1,
      title: 'New Goal',
      requirements: [],
    });
  }, [postGoal]);

  return (
    <Button className='flex gap-2' disabled={isPending} onClick={clickHandler}>
      <Plus size={16} />
      <span>Add Learning Goal</span>
    </Button>
  );
}
