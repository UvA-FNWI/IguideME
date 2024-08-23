'use client';

import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { getCoursesByUser } from '@/api/course';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import { WorkflowStates } from '@/types/course';
import { UserRoles } from '@/types/user';

import { CourseCard, SkeletonCourseCard } from './course-card';

export function CourseSelection(): ReactElement {
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  const {
    data: courses,
    isError,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ['courses', self.userID], queryFn: () => getCoursesByUser(self.userID) });

  return (
    <div className='min-h-[calc(100dvh-72px)]'>
      <div className='mb-8'>
        <h2 className='text-4xl font-semibold tracking-tighter'>Select a course</h2>
        <p className='text-base text-muted-foreground'>
          Is your course not listed? Please contact your instructor or course coordinator to get access to the course.
        </p>
      </div>

      <Tabs className='flex w-full flex-col items-center justify-center lg:items-start' defaultValue='published'>
        <TabsList
          className={`mb-4 grid w-full max-w-[400px] grid-cols-2 ${self.role === UserRoles.Instructor ? 'grid-cols-3' : 'grid-cols-2'}`}
        >
          {self.role === UserRoles.Instructor && <TabsTrigger value='unpublished'>Unpublished</TabsTrigger>}
          <TabsTrigger value='published'>Published</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
        </TabsList>

        {isError ?
          <div className='mt-4 flex flex-col items-center justify-center gap-2 text-sm'>
            <p className='w-full max-w-[400px] text-justify'>
              Due to an error, we could not load the courses. This might be due to network issues or server problems.
              Please check your internet connection and try again later.
            </p>
            <Button
              onClick={async () => {
                await refetch();
              }}
              variant='secondary'
            >
              Try again
            </Button>
          </div>
        : isLoading ?
          <div className='flex w-full flex-wrap justify-center gap-8 lg:justify-start'>
            {Array.from({ length: 6 }).map((_, index: number) => (
              // eslint-disable-next-line react/no-array-index-key -- skeleton array
              <SkeletonCourseCard key={index} />
            ))}
          </div>
        : <>
            {self.role === UserRoles.Instructor && (
              <TabsContent value='unpublished'>
                <div className='flex w-full flex-wrap justify-center gap-8 lg:justify-start'>
                  {courses?.length ?
                    courses.filter((course) => course.workflowState === WorkflowStates.UNPUBLISHED).map(CourseCard)
                  : <p className='text-center'>No unpublished courses found.</p>}
                </div>
              </TabsContent>
            )}
            <TabsContent value='published'>
              <div className='flex w-full flex-wrap justify-center gap-8 lg:justify-start'>
                {courses?.length ?
                  courses.filter((course) => course.workflowState === WorkflowStates.AVAILABLE).map(CourseCard)
                : <p className='text-center'>No published courses found.</p>}
              </div>
            </TabsContent>
            <TabsContent value='completed'>
              <div className='flex w-full flex-wrap justify-center gap-8 lg:justify-start'>
                {courses?.length ?
                  courses.filter((course) => course.workflowState === WorkflowStates.COMPLETED).map(CourseCard)
                : <p className='text-center'>No completed courses found.</p>}
              </div>
            </TabsContent>
          </>
        }
      </Tabs>
    </div>
  );
}
