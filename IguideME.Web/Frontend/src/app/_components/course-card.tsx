import type { ReactElement } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/types/course';

function CourseCard(course: Course): ReactElement {
  return (
    <Card key={course.id}>
      <CardHeader>
        {/* eslint-disable-next-line @next/next/no-img-element -- using <img> until domain is confirmed for optimization */}
        <img alt={course.name} src={course.courseImage} className='h-[200px] w-[300px]' width={300} height={200} />
      </CardHeader>
      <CardContent className='flex justify-between'>
        <div>
          <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap'>{course.name}</CardTitle>
          <CardDescription>{course.courseCode}</CardDescription>
        </div>
        <Button asChild>
          <Link href={`/courses/${String(course.id)}`}>View Course</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SkeletonCourseCard(): ReactElement {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-[200px] w-[300px]' />
      </CardHeader>
      <CardContent className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap'>
            <Skeleton className='h-7 w-24' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-5 w-16' />
          </CardDescription>
        </div>
        <Skeleton className='h-10 w-28' />
      </CardContent>
    </Card>
  );
}

export { CourseCard, SkeletonCourseCard };
