import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { getLearningGoals } from '@/api/entry';
import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';
import type { LearningGoal } from '@/types/tile';

import { AddLearningGoal } from './_components/add-learning-goal';
import { LearningGoalCard } from './_components/learning-goal-card';

export default async function LearningGoals(): Promise<ReactElement> {
  let isError = false;
  let goals: LearningGoal[] = [];

  try {
    goals = await getLearningGoals();
  } catch {
    isError = true;
  }

  return (
    <>
      <AdminHeader title='Learning Goals' subtitle='Configure the learning goals for the course.' />
      <div className='mb-4 flex w-full justify-end'>
        <AddLearningGoal />
      </div>
      {isError ?
        <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
          <CircleAlert className='h-12 w-12 stroke-destructive' />
          <i className='text-base text-destructive'>Error: Tiles could not be loaded</i>
        </div>
      : goals.map((goal) => <LearningGoalCard key={goal.id} goal={goal} />)}
    </>
  );
}
