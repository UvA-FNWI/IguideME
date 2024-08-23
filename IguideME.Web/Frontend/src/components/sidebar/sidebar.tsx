'use client';

import type { ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/cn';
import { useSidebarStore } from '@/stores/sidebar-store';

import { SidebarLogo } from './sidebar-logo';
import { SidebarMenu } from './sidebar-menu';
import { SidebarToggle } from './sidebar-toggle';

export function Sidebar(): ReactElement {
  const { isOpen } = useSidebarStore(useShallow((state) => ({ isOpen: state.isOpen })));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        !isOpen ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle />
      <div className='relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md shadow-foreground'>
        <SidebarLogo />
        <SidebarMenu />
      </div>
    </aside>
  );
}
