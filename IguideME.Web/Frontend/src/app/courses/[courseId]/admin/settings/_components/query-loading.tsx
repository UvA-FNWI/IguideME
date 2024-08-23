'use client';

import { type ReactElement, type ReactNode } from 'react';
import { Spin, type SpinProps } from 'antd';

import { cn } from '@/lib/cn';

interface QueryLoadingProps extends SpinProps {
  children: ReactNode;
  isLoading: boolean;
}

function QueryLoading({ children, className, isLoading, ...props }: QueryLoadingProps): ReactElement {
  return (
    <Spin
      className={cn(isLoading ? `!text-text cursor-wait [&_i]:!bg-primary` : '', className)}
      spinning={isLoading}
      {...props}
    >
      {children}
    </Spin>
  );
}

export { QueryLoading };
