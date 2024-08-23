'use client';

import { type FC, Fragment, memo } from 'react';
import Link from 'next/link';

import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useWindowSize } from '@/hooks/use-window-size';

import type { BreadcrumbPart } from './navigation-breadcrumb';

interface NavigationBreadcrumbItemsProps {
  /** List of breadcrumb parts to render. */
  items: BreadcrumbPart[];

  isError?: boolean;
  isLoading?: boolean;
}

const NavigationBreadcrumbItems: FC<NavigationBreadcrumbItemsProps> = memo(({ items, isError, isLoading }) => {
  const { width } = useWindowSize();

  if (isError) {
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className='italic text-destructive'>Error</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  } else if (isLoading) {
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>
            <Skeleton className='h-4 w-10' />
          </BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  } else if (width < 640) {
    // Get all items except the first and last
    const itemsToDisplay = items.slice(1, items.length - 1);
    const lastItem = items[items.length - 1];

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        {items[0] !== lastItem && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center gap-1'>
                  <BreadcrumbEllipsis className='h-4 w-4' />
                  <span className='sr-only'>Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  {itemsToDisplay.map((part) => (
                    <DropdownMenuItem asChild key={part.path}>
                      <Link href={part.path}>{part.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{lastItem?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </>
    );
  }
  return items.map((part, index) => (
    <Fragment key={part.name}>
      <BreadcrumbItem>
        {index === items.length - 1 ?
          <BreadcrumbPage>{part.name}</BreadcrumbPage>
        : <BreadcrumbLink href={part.path}>{part.name}</BreadcrumbLink>}
      </BreadcrumbItem>
      {index < items.length - 1 && <BreadcrumbSeparator />}
    </Fragment>
  ));
});
NavigationBreadcrumbItems.displayName = 'NavigationBreadcrumbItems';
export { NavigationBreadcrumbItems };
