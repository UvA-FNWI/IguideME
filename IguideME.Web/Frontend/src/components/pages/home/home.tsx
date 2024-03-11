import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';

const Home: FC = (): ReactElement => {
  return (
    <Result
      icon={<SmileOutlined />}
      title={
        <div>
          <h2>Pick a student to start!</h2>
          <h1 className="font-bold text-[5vmax] font-maitree p-0 text-black/10 inline-block transition-all duration-300 ease-in-out hover:cursor-brand hover:opacity-80 hover:scale-110 hover:text-indigo-600">
            IguideME
          </h1>
        </div>
      }
    />
  );
};

export default Home;
