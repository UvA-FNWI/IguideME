import { Form, InputNumber, Row, Select } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useQuery } from 'react-query';

import { getAssignments } from '@/api/assignments';

const { Item } = Form;

const EditTileAssignments: FC = (): ReactElement => {
	const { data: assignments } = useQuery('assignments', getAssignments);

	return (
		<>
			<Row>
				<Item name="weight" label="Weight">
					<InputNumber />
				</Item>
			</Row>
			<Row>
				<Item name="entries" label="Assignments">
					<Select mode="multiple" options={} />
				</Item>
			</Row>
		</>
	);
};

export default EditTileAssignments;
