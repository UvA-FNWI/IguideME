'use client';

import { type FC, memo, type ReactElement } from 'react';
import Avatar from 'boring-avatars';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRoutes } from '@/hooks/use-routes';
import { cn } from '@/lib/cn';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import { useSidebarStore } from '@/stores/sidebar-store';
import { UserRoles } from '@/types/user';

import { type RouteWithSubRoutes, SidebarSubmenu } from './sidebar-submenu';

const SidebarMenu: FC<{ openOverride?: boolean }> = memo(({ openOverride }): ReactElement => {
  const { isOpen } = useSidebarStore(useShallow((state) => ({ isOpen: state.isOpen })));
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));
  const routes = useRoutes();

  return (
    <ScrollArea className='flex-grow [&>div>div[style]]:!block'>
      <nav className='mt-8 w-full'>
        <ul className='flex min-h-[calc(100dvh-136px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100dvh-104px)]'>
          {routes.map((route) => {
            if (route.subRoutes) {
              return (
                <div className='w-full' key={route.label}>
                  <SidebarSubmenu openOverride={openOverride} route={route as RouteWithSubRoutes} />
                </div>
              );
            }

            return (
              <div className='w-full' key={route.label}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <span>
                        {route.routeType === 'public' || self.role === route.routeType ?
                          route.status === 'disabled' ?
                            <Button aria-disabled className='mb-1 h-10 w-full justify-start' disabled variant='ghost'>
                              <span className={cn(!(openOverride ?? isOpen) ? '' : 'mr-4')}>
                                <route.icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  'max-w-[200px] truncate',
                                  !(openOverride ?? isOpen) ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100',
                                )}
                              >
                                {route.label}
                              </p>
                            </Button>
                          : <Button
                              asChild
                              className='mb-1 h-10 w-full justify-start'
                              variant={route.status === 'active' ? 'secondary' : 'ghost'}
                            >
                              <Link href={route.href}>
                                <span className={cn(!(openOverride ?? isOpen) ? '' : 'mr-4')}>
                                  <route.icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate',
                                    !(openOverride ?? isOpen) ? '-translate-x-96 opacity-0' : (
                                      'translate-x-0 opacity-100'
                                    ),
                                  )}
                                >
                                  {route.label}
                                </p>
                              </Link>
                            </Button>

                        : null}
                      </span>
                    </TooltipTrigger>
                    {!(openOverride ?? isOpen) ?
                      <TooltipContent side='right'>
                        {route.label}
                        {route.status === 'disabled' && (
                          <>
                            <br />
                            {route.whenAvailable}
                          </>
                        )}
                      </TooltipContent>
                    : route.status === 'disabled' ?
                      <TooltipContent side='right'>
                        {route.whenAvailable ? route.whenAvailable : route.label}
                      </TooltipContent>
                    : null}
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}

          <ul
            className={`!m-0 flex ${openOverride ?? isOpen ? 'flex-row items-end justify-center' : 'flex-col items-center justify-end'} w-full grow gap-2`}
          >
            <li className={`h-12 ${openOverride ?? isOpen ? 'flex-1' : ''} rounded-md border-2 border-muted`}>
              <ThemeSwitcher variant={openOverride ?? isOpen ? 'full' : 'compact'} />
            </li>
          </ul>

          <li className='flex w-full flex-col justify-end'>
            <Separator className='my-4' />
            <div
              className={`flex w-full ${openOverride ?? isOpen ? 'justify-start' : 'justify-center'} h-10 items-center gap-2`}
            >
              <Avatar name={self.name} square />
              {openOverride ?? isOpen ?
                <div className='flex flex-col'>
                  <span className='text-sm font-bold'>{self.name}</span>
                  <span className='text-xs'>{UserRoles[self.role]}</span>
                </div>
              : null}
            </div>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
});
SidebarMenu.displayName = 'SidebarMenu';
export { SidebarMenu };
