import type { ReactElement, ReactNode } from 'react';

import { Sidebar } from '@/components/sidebar/sidebar';

import { NavigationContent } from './navigation-content';
import { NavigationSkip } from './navigation-skip';

export function NavigationLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className='flex h-screen w-screen'>
      <NavigationSkip />
      <Sidebar />
      <NavigationContent>{children}</NavigationContent>
    </div>
  );
}
