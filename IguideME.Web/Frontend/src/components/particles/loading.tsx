import { Spin } from 'antd';
import { type FC, type ReactElement } from 'react';

const LoadingCentered: FC = (): ReactElement => {
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Spin tip="Loading" size="large">
				<div className="content" />
			</Spin>
		</div>
	);
};

export default LoadingCentered;
