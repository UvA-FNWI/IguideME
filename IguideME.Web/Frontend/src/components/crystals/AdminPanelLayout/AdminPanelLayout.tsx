import { Outlet } from 'react-router-dom';
import { type FC, type ReactElement } from 'react';

const AdminPanelLayout: FC = (): ReactElement => {
  return (
    <div className='p-4'>
      <Outlet />
    </div>
  );
};

export default AdminPanelLayout;
