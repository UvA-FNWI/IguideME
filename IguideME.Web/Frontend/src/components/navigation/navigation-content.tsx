'use client';

import type { ReactElement, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MobileHeader } from '@/components/sidebar/mobile-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarStore } from '@/stores/sidebar-store';

import { NavigationBreadcrumb } from './navigation-breadcrumb/navigation-breadcrumb';

export function NavigationContent({ children }: { children: ReactNode }): ReactElement {
  const { isOpen } = useSidebarStore(useShallow((state) => ({ isOpen: state.isOpen })));

  return (
    <div
      className={`flex flex-grow flex-col bg-foreground/5 transition-[margin-left] duration-300 ease-in-out ${isOpen ? 'lg:ml-72' : 'lg:ml-[90px]'} h-screen overflow-hidden`}
    >
      <div className='lg:hidden'>
        <MobileHeader />
      </div>
      <NavigationBreadcrumb className='my-2 hidden px-3 lg:mx-6 lg:block' />
      <main className='flex-grow overflow-y-auto rounded-md bg-background p-2 px-3 lg:mx-6 lg:mb-2' id='main-content'>
        <ScrollArea>{children}</ScrollArea>
      </main>
    </div>
  );
}
