import type { ReactElement } from 'react';

import { NavigationBreadcrumb } from '@/components/navigation/navigation-breadcrumb/navigation-breadcrumb';

import { MobileMenu } from './mobile-menu';

export function MobileHeader(): ReactElement {
  return (
    <header className='sticky top-0 z-10 w-full bg-background shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
      <div className='mx-4 flex h-14 items-center sm:mx-8'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <MobileMenu />
          <NavigationBreadcrumb className='my-2 px-3 lg:mx-6 lg:px-0' />
        </div>
      </div>
    </header>
  );
}
