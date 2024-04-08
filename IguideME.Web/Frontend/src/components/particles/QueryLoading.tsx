import { Spin } from 'antd';
import { FC, ReactNode } from 'react';

type QueryLoadingProps = {
  children: ReactNode;
  isLoading: boolean;
};

const QueryLoading: FC<QueryLoadingProps> = ({ children, isLoading }) => {
  return (
    <Spin className={isLoading ? 'cursor-wait' : ''} spinning={isLoading}>
      {children}
    </Spin>
  );
};

export default QueryLoading;
