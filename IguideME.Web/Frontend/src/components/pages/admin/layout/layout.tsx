import { type FC, type ReactElement } from 'react';

import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import LayoutConfigurator from '@/components/crystals/layout-configurator/layout-configurator';

const EditLayout: FC = (): ReactElement => {
  return (
    <div>
      <AdminTitle title="Layout" description="Configure the layout of the student dashboard." />
      <LayoutConfigurator />
    </div>
  );
};

export default EditLayout;
