'use client';

import { createElement, type FC, memo, type ReactElement, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Route } from '@/hooks/use-routes';
import { useSidebarStore } from '@/stores/sidebar-store';

interface RouteWithSubRoutes extends Route {
  subRoutes: Route[];
}

const SidebarSubmenu: FC<{
  openOverride?: boolean;
  route: RouteWithSubRoutes;
}> = memo(({ openOverride, route }): ReactElement => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { isOpen } = useSidebarStore(useShallow((state) => ({ isOpen: state.isOpen })));
  const isSubmenuActive = route.subRoutes.some((subRoute) => subRoute.status === 'active');

  if (openOverride ?? isOpen) {
    return (
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <span>
              <Collapsible
                aria-disabled={route.status === 'disabled'}
                disabled={route.status === 'disabled'}
                open={isCollapsed}
                onOpenChange={setIsCollapsed}
                className='w-full'
              >
                <CollapsibleTrigger className='mb-1 [&[data-state=open]>div>div>svg]:rotate-180' asChild>
                  <Button
                    variant={route.status === 'active' || isSubmenuActive ? 'secondary' : 'ghost'}
                    className='h-10 w-full justify-start'
                  >
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='mr-4'>
                          <route.icon size={18} />
                        </span>
                        <p className='max-w-[150px] translate-x-0 truncate opacity-100'>{route.label}</p>
                      </div>
                      <div className='translate-x-0 whitespace-nowrap opacity-100'>
                        <ChevronDown size={18} className='transition-transform duration-200' />
                      </div>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden'>
                  {route.subRoutes.map(({ href, label, status, icon }) => (
                    <Button
                      key={href}
                      variant={status === 'active' ? 'secondary' : 'ghost'}
                      className='mb-1 h-10 w-full justify-start'
                      asChild
                    >
                      <Link href={href}>
                        <span className='ml-2 mr-4'>{createElement(icon, { size: 18 })}</span>
                        <p className='max-w-[170px] translate-x-0 truncate opacity-100'>{label}</p>
                      </Link>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </span>
          </TooltipTrigger>
          {route.status === 'disabled' ?
            <TooltipContent side='right'>{route.whenAvailable ? route.whenAvailable : route.label}</TooltipContent>
          : null}
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <span>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-disabled={route.status === 'disabled'}
                  className='mb-1 h-10 w-full justify-start'
                  disabled={route.status === 'disabled'}
                  variant={route.status === 'active' ? 'secondary' : 'ghost'}
                >
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <span>
                        <route.icon size={18} />
                      </span>
                      <p className='max-w-[200px] truncate opacity-0'>{route.label}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent side='right' align='start' alignOffset={2}>
            {route.status === 'disabled' ?
              <>
                {route.label}
                <br />
                {route.whenAvailable}
              </>
            : route.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side='right' sideOffset={25} align='start'>
        <DropdownMenuLabel className='max-w-[190px] truncate'>{route.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {route.subRoutes.map(({ href, label }) => (
          <DropdownMenuItem key={href} asChild>
            <Link className='cursor-pointer' href={href}>
              <p className='max-w-[180px] truncate'>{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
SidebarSubmenu.displayName = 'SidebarSubmenu';

export type { RouteWithSubRoutes };
export { SidebarSubmenu };
