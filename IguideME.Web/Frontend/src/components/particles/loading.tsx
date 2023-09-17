import { Spin } from 'antd';
import { type FC, type ReactElement } from 'react';

const LoadingCentered: FC = (): ReactElement => {
	return (
		// <div style={{ display: 'flex', justifyContent: 'center' }}>
		<div>
			<Spin tip="Loading" size="large" style={{ marginLeft: 'auto', marginRight: 'auto', height: 80 }}>
				<div className="content" />
			</Spin>
		</div>
	);
};

export default LoadingCentered;
