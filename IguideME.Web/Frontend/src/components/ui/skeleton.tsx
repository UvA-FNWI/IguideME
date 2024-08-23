import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
