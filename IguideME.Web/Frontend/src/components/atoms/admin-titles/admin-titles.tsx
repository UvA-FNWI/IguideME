import { type FC, type ReactElement } from 'react';

import { Divider } from 'antd';

interface Props {
  title: string;
  description: ReactElement | string;
}

const AdminTitle: FC<Props> = ({ title, description }): ReactElement => {
  return (
    <>
      <div>
        <h1 className="pb-2 text-[2em] font-tnum">{title}</h1>
        <p className="text-black font-tnum">{description}</p>
      </div>
      <Divider className="my-5" />
    </>
  );
};

export default AdminTitle;