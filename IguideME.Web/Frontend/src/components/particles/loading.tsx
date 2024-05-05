import { Spin } from 'antd';
import { type FC, type ReactElement } from 'react';

const Loading: FC = (): ReactElement => {
  return (
    <Spin className='mx-auto h-20 !text-text [&_i]:!bg-text' size='large' tip='Loading'>
      <></>
    </Spin>
  );
};

export default Loading;
