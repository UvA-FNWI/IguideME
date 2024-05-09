import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import LayoutConfigurator from '@/components/crystals/layout-configurator/layout-configurator';
import { type FC, type ReactElement } from 'react';

const EditLayout: FC = (): ReactElement => {
  return (
    <>
      <AdminTitle title='Layout' description='Configure the layout of the student dashboard.' />
      <LayoutConfigurator />
    </>
  );
};

export default EditLayout;
