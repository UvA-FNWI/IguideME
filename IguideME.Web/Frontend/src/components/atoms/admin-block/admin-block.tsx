import { Divider } from 'antd';

import { type FC, type ReactElement } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const AdminBlock: FC<Props> = ({ title, children }): ReactElement => {
  return (
    <div className="border border-solid bg-white my-[10px] p-[10px]">
      <h2 className="text-lg">{title}</h2>
      <Divider className="mt-1 mb-2" />
      {children}
    </div>
  );
};

export default AdminBlock;
