import type { ReactElement } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useSidebarStore } from '@/stores/sidebar-store';

export function SidebarToggle(): ReactElement {
  const { isOpen, setIsOpen } = useSidebarStore(
    useShallow((state) => ({ isOpen: state.isOpen, setIsOpen: state.setIsOpen })),
  );

  return (
    <div className='invisible absolute -right-[16px] top-[12px] z-20 lg:visible'>
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className='h-8 w-8 rounded-md'
        variant='outline'
        size='icon'
      >
        <ChevronLeft
          className={cn('h-4 w-4 transition-transform duration-700 ease-in-out', !isOpen ? 'rotate-180' : 'rotate-0')}
        />
      </Button>
    </div>
  );
}
