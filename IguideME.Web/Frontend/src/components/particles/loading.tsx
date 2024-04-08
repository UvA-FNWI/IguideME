import { Spin } from 'antd';
import { type FC, type ReactElement } from 'react';

const Loading: FC = (): ReactElement => {
  return (
    <Spin className='mx-auto h-20' size='large' tip='Loading'>
      <></>
    </Spin>
  );
};

export default Loading;
