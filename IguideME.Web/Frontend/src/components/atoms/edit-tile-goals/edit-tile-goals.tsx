import { PlusOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import { type FC, type ReactElement } from 'react';

const EditTileGoals: FC = (): ReactElement => {
	return (
		<Row style={{ marginTop: '1em' }}>
			<Button type="dashed" onClick={() => {}} block icon={<PlusOutlined />}>
				Add outcome
			</Button>
		</Row>
	);
};

export default EditTileGoals;
