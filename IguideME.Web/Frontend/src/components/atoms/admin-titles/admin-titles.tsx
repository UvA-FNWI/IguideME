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
        <h1 className="font-semibold pb-2">{title}</h1>
        <p className="text-black">{description}</p>
      </div>
      <Divider className="my-5" />
    </>
  );
};

export default AdminTitle;
