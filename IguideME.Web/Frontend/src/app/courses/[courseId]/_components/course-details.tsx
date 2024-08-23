'use client';

import type { ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useGlobalContext } from '@/stores/global-store/use-global-store';

export function CourseDetails({ studentAmount }: { studentAmount?: number }): ReactElement {
  const { course } = useGlobalContext(useShallow((state) => ({ course: state.course })));

  return (
    <>
      <h1 className='mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl'>{course?.name ?? 'Course not found'}</h1>
      <p className='text-xl text-muted-foreground'>
        This course is currently {course?.isPublic ? 'public' : 'private'} and has {studentAmount ?? <i>unknown</i>}{' '}
        students.
      </p>
    </>
  );
}
