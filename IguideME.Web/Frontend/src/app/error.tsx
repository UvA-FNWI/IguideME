'use client';

import { type ReactElement } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): ReactElement {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <div className='mb-8 flex items-center justify-center'>
        <h1 className='text-2xl'>Error</h1>
        <Separator className='mx-2' orientation='vertical' />
        <h2 className='text-xl'>An unknown error occurred</h2>
      </div>

      <p className='mb-4'>{error.message}</p>

      <div className='flex gap-2'>
        <Button
          onClick={() => {
            reset();
          }}
        >
          Try again
        </Button>
        <Button asChild variant='secondary'>
          <Link href='/'>Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
