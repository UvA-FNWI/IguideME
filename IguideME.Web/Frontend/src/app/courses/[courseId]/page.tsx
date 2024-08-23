import type { ReactElement } from 'react';

import { getStudentsByCourse } from '@/api/course';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import type { User } from '@/types/user';

import { Autocomplete } from './_components/autocomplete';
import { CourseDetails } from './_components/course-details';

export default async function SelectStudent({ params }: { params: { courseId: string } }): Promise<ReactElement> {
  let isError = false;
  let students: User[] | undefined;

  try {
    students = await getStudentsByCourse(params.courseId);
  } catch {
    isError = true;
  }

  return (
    <div className='mt-8 grid h-auto w-full items-center gap-12 md:mt-0 md:h-[calc(100dvh-72px)] md:grid-cols-2 lg:h-[calc(100dvh-60px)]'>
      <div className='mx-auto h-fit text-center md:h-auto md:text-left'>
        <p className='inline-block bg-gradient-to-l from-blue-600 to-violet-500 bg-clip-text text-sm font-medium text-transparent dark:from-blue-400 dark:to-violet-400'>
          You&apos;re course at a glance
        </p>
        <div className='mt-4 max-w-2xl md:mb-12'>
          <CourseDetails studentAmount={students?.length} />
        </div>
      </div>
      <div className='mx-auto h-[300px] md:h-auto'>
        <div className='ms-auto lg:mx-auto lg:me-0 lg:max-w-lg'>
          <Card>
            <CardHeader className='text-center'>
              <h2 className='text-2xl font-semibold leading-none tracking-tight'>View a student&apos;s dashboard</h2>
              <CardDescription>Select a student from the list below to view their dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Autocomplete isError={isError} students={students} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
