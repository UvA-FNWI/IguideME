import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/spotlight';

import { CourseSelection } from './_components/course-select';

export default function Home(): ReactElement {
  return (
    <>
      <div className='relative flex h-[calc(100dvh-72px)] w-full flex-col items-center justify-center overflow-hidden lg:h-[calc(100dvh-44px)]'>
        <Spotlight className='lg:left-30 1k:left-80 1k:top-0 2k:left-96 4k:left-[600px] 4k:-top-20 8k:left-[1300px] absolute inset-0 left-5 top-5 sm:-top-10 sm:left-28 md:left-10 md:top-5 lg:top-12 xl:left-40' />
        <div className='mx-auto max-w-2xl'>
          <div className='space-y-5 text-center'>
            <p className='text-base'>Track, Improve, Thrive</p>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>IguideME</h1>
            <p className='text-xl text-muted-foreground'>
              Your partner in enhancing self-directed learning and academic success.
            </p>
          </div>
          <div className='mt-8 flex justify-center gap-3'>
            <Button asChild size='lg'>
              <a href='#start-course-selection'>Get started by selecting a course</a>
            </Button>
          </div>
        </div>
      </div>
      <div className='w-full' id='start-course-selection'>
        <CourseSelection />
      </div>
    </>
  );
}
