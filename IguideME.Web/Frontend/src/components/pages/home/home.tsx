import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';

const Home: FC = (): ReactElement => {
  return (
    <Result
      icon={<SmileOutlined className='!text-logo' />}
      title={
        <div>
          <h2>Pick a student to start!</h2>
          <h1 className='font-bold text-[5vmax] p-0 text-text opacity-20 inline-block transition-all duration-300 ease-in-out hover:cursor-brand hover:opacity-80 hover:scale-110 hover:text-logo'>
            IguideME
          </h1>
        </div>
      }
    />
  );
};

export default Home;
