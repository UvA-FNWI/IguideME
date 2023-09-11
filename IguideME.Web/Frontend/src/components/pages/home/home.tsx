import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';

import './style.scss';

const Home: FC = (): ReactElement => {
	return (
		<div>
			<Result
				icon={<SmileOutlined />}
				title={
					<div>
						<h2>Pick a student to start!</h2>
						<h1 id={'brand'}>IguideME</h1>
					</div>
				}
			/>
		</div>
	);
};

export default Home;
