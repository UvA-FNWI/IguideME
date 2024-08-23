'use client';

import { type ReactElement } from 'react';
import { Result, type ResultProps } from 'antd';

import { cn } from '@/lib/cn';

function QueryError({ className, title, ...props }: ResultProps): ReactElement {
  return (
    <Result
      className={cn(
        '[&>div]:!text-text [&_span]:text-failure absolute inset-0 h-full w-full [&>div]:!m-0 [&_span]:!text-lg',
        className,
      )}
      status='error'
      title={title}
      {...props}
    />
  );
}

export { QueryError };
