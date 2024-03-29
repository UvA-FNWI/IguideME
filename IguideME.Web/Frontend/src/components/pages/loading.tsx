import Loading from '../particles/loading';
import { FC, ReactElement } from 'react';

const LoadingPage: FC = (): ReactElement => {
  return (
    <div className="grid items-center" style={{ width: '100vw', height: '100vh' }}>
      <Loading />
    </div>
  );
};

export default LoadingPage;
