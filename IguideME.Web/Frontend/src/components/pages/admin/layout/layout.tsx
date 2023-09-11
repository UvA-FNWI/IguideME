import { type FC, type ReactElement } from 'react';

import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import LayoutConfigurator from '@/components/crystals/layout-configurator/layout-configurator';
// import LayoutVisualizer from '@/components/crystals/layout-visualizer/layout-visualizer';
// import { Divider } from 'antd';

const Layout: FC = (): ReactElement => {
	return (
		<div>
			<AdminTitle title="Layout" description="Configure the layout of the student dashboard." />
			<LayoutConfigurator />

			{/* <Divider style={{ margin: '10px' }} />
        <LayoutVisualizer /> */}
		</div>
	);
};

export default Layout;
