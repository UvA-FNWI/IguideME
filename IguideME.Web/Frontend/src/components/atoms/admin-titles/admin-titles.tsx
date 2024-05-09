import { Divider } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  title: string;
  description: ReactElement | string;
}

const AdminTitle: FC<Props> = ({ title, description }): ReactElement => {
  return (
    <>
      <div>
        <h1 className='font-tnum pb-2 text-[2em]'>{title}</h1>
        <p className='font-tnum text-text'>{description}</p>
      </div>
      <Divider className='my-5' />
    </>
  );
};

export default AdminTitle;
