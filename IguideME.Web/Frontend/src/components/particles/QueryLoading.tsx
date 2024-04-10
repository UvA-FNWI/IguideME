import { FC, ReactNode } from 'react';
import { Spin, SpinProps } from 'antd';

interface QueryLoadingProps extends SpinProps {
  children: ReactNode;
  isLoading: boolean;
}

const QueryLoading: FC<QueryLoadingProps> = ({ children, isLoading }) => {
  return (
    <Spin className={isLoading ? 'cursor-wait' : ''} spinning={isLoading}>
      {children}
    </Spin>
  );
};

export default QueryLoading;
