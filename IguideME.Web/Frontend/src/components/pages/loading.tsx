import { FC, ReactElement } from 'react';
import Loading from '../particles/loading';

const LoadingPage: FC = (): ReactElement => {
  return (
    <div className='grid items-center [&_i]:!bg-surface1' style={{ width: '100vw', height: '100vh' }}>
      <Loading />
    </div>
  );
};

export default LoadingPage;
