'use client';

import { type FC, memo, type ReactElement } from 'react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { Hat, Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useSidebarStore } from '@/stores/sidebar-store';

const SidebarLogo: FC<{ openOverride?: boolean }> = memo(({ openOverride }): ReactElement => {
  const { isOpen } = useSidebarStore(useShallow((state) => ({ isOpen: state.isOpen })));

  return (
    <Button
      className={cn(
        'mb-1 transition-transform duration-300 ease-in-out',
        !openOverride || !isOpen ? 'translate-x-1' : 'translate-x-0',
      )}
      variant='link'
      asChild
    >
      <Link href='/' className='!m-0 flex h-10 items-center justify-center gap-2 !p-0'>
        {openOverride ?? isOpen ?
          <Logo width='100%' />
        : <Hat width='50px' height='40px' />}
      </Link>
    </Button>
  );
});
SidebarLogo.displayName = 'SidebarLogo';
export { SidebarLogo };
