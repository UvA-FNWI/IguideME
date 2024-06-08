import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';

const Home: FC = (): ReactElement => {
  return (
    <Result
      icon={<SmileOutlined className='!text-primary' />}
      title={
        <div>
          <h2 className='text-text'>Pick a student to start!</h2>
          <h1 className='inline-block p-0 text-[5vmax] font-bold text-text opacity-40 transition-all duration-300 ease-in-out hover:scale-110 hover:cursor-brand hover:text-primary hover:opacity-80'>
            IguideME
          </h1>
        </div>
      }
    />
  );
};

export default Home;
