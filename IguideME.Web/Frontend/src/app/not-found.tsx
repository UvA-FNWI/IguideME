import type { ReactElement } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function NotFound(): ReactElement {
  return (
    <div className='flex h-[calc(100dvh-72px)] w-full flex-col items-center justify-center lg:h-[calc(100dvh-44px)]'>
      <div className='mb-8 flex items-center justify-center'>
        <h1 className='text-2xl'>404</h1>
        <Separator className='mx-2 h-7' orientation='vertical' />
        <h2 className='text-xl'>Not Found</h2>
      </div>

      <p className='mb-4'>The page you are looking for does not exist.</p>

      <Button asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
