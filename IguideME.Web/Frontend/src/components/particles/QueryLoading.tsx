import { cn } from '@/utils/cn';
import { FC, ReactNode } from 'react';
import { Spin, SpinProps } from 'antd';
import { useTheme } from 'next-themes';

interface QueryLoadingProps extends SpinProps {
  children: ReactNode;
  isLoading: boolean;
}

const QueryLoading: FC<QueryLoadingProps> = ({ children, className, isLoading }) => {
  const { theme } = useTheme();
  return (
    <Spin
      className={cn(isLoading ? `cursor-wait ${theme === 'dark' ? '[&_i]:!bg-text' : ''}` : '', className)}
      spinning={isLoading}
    >
      {children}
    </Spin>
  );
};

export default QueryLoading;
