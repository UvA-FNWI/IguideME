import { cn } from '@/utils/cn';
import { type FC, type ReactNode } from 'react';
import { Spin, type SpinProps } from 'antd';

interface QueryLoadingProps extends SpinProps {
  children: ReactNode;
  isLoading: boolean;
}

const QueryLoading: FC<QueryLoadingProps> = ({ children, className, isLoading, ...props }) => {
  return (
    <Spin
      className={cn(isLoading ? `cursor-wait !text-text [&_i]:!bg-primary` : '', className)}
      spinning={isLoading}
      {...props}
    >
      {children}
    </Spin>
  );
};

export default QueryLoading;
