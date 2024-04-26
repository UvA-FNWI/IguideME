import { cn } from '@/utils/cn';
import { Spin, SpinProps } from 'antd';
import { FC, ReactNode } from 'react';

interface QueryLoadingProps extends SpinProps {
  children: ReactNode;
  isLoading: boolean;
}

const QueryLoading: FC<QueryLoadingProps> = ({ children, className, isLoading }) => {
  return (
    <Spin className={cn(isLoading ? 'cursor-wait' : '', className)} spinning={isLoading}>
      {children}
    </Spin>
  );
};

export default QueryLoading;
