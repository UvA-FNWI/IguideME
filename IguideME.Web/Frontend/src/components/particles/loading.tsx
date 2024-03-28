import { Spin } from 'antd';
import { type FC, type ReactElement } from 'react';

const Loading: FC = (): ReactElement => {
  return (
    <div className="relative">
      <Spin className="mx-auto h-20" size="large" tip="Loading">
        <></>
      </Spin>
    </div>
  );
};

export default Loading;
