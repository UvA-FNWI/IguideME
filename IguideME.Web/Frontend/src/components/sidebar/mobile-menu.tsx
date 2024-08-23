import type { ReactElement } from 'react';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';

import { SidebarLogo } from './sidebar-logo';
import { SidebarMenu } from './sidebar-menu';

export function MobileMenu(): ReactElement {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-8 flex-shrink-0 bg-background' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full flex-col px-3 sm:w-72' side='left'>
        <SheetHeader>
          <SidebarLogo openOverride />
        </SheetHeader>
        <SidebarMenu openOverride />
      </SheetContent>
    </Sheet>
  );
}
