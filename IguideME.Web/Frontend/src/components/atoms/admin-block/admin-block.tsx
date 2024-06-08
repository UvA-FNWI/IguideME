import { Divider } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const AdminBlock: FC<Props> = ({ title, children }): ReactElement => {
  return (
    <div className='my-[10px] rounded-lg border border-solid border-border1 bg-surface1 p-[10px]'>
      <h2 className='text-lg'>{title}</h2>
      <Divider className='mb-2 mt-1' />
      {children}
    </div>
  );
};

export default AdminBlock;
