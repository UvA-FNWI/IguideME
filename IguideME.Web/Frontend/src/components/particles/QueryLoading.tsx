import { cn } from '@/utils/cn';
import { Spin, SpinProps } from 'antd';
import { FC, ReactNode } from 'react';

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
