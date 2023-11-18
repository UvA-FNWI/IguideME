import { Button, Row } from 'antd';
import { type FC, type ReactElement } from 'react';

const EditTileGoals: FC = (): ReactElement => {
	return (
		<Row style={{ marginTop: '1em' }}>
			<Button>Add goal</Button>
		</Row>
	);
};

export default EditTileGoals;
