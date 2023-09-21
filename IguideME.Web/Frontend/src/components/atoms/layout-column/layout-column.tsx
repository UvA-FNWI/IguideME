import { Col, Divider, Form, type FormInstance, InputNumber, Row, Slider, Transfer } from 'antd';
import { type FC, type ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { DeleteFilled } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { getTileGroups } from '@/api/tiles';

import './style.scss';

const MIN_WIDTH = 1;
const MAX_WIDTH = 100;
const formatter = (value: number | undefined): string => (value !== undefined ? `${value}%` : '');

interface Props {
	name: number;
	restField?: { fieldKey?: number | undefined };
	remove?: (index: number | number[]) => void;
	form: FormInstance;
}

interface RecordType {
	key: string;
	title: string;
}

const ConfigLayoutColumn: FC<Props> = ({ name, restField, form, remove }): ReactElement => {
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: form.getFieldValue(['columns', name]).id,
		data: { name, restField },
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	if (isDragging) {
		return <div ref={setNodeRef} style={style} className="LayoutColumn"></div>;
	}
	console.log('test', name);

	return (
		<div className="LayoutColumn" ref={setNodeRef} style={style}>
			<Row justify={'space-between'} {...attributes} {...listeners} style={{ cursor: 'grab' }}>
				<Col>
					<h3>Column</h3>
				</Col>
				<Col>
					<DeleteFilled onClick={() => remove?.(name)} />
				</Col>
			</Row>

			<Divider style={{ margin: '10px', marginLeft: 0 }} />

			<Row align="middle" justify="space-between">
				<Col span={3}>
					<span>Width:</span>
				</Col>
				<Col span={14}>
					<Form.Item {...restField} name={[name, 'width']} initialValue={50}>
						<Slider min={MIN_WIDTH} max={MAX_WIDTH} tooltip={{ formatter }} />
					</Form.Item>
				</Col>
				<Col span={7}>
					<Form.Item {...restField} name={[name, 'width']}>
						<InputNumber min={MIN_WIDTH} max={MAX_WIDTH} formatter={formatter} />
					</Form.Item>
				</Col>
			</Row>

			<Divider style={{ margin: '10px', marginLeft: 0 }} />
			<div style={{ marginBottom: '10px' }}>Tile Groups:</div>

			<Row justify="center">
				<Form.Item {...restField} name={[name, 'groups']} trigger="onChange" initialValue={[]}>
					<TransferWrapper />
				</Form.Item>
			</Row>
		</div>
	);
};

interface TransferProps {
	value?: string[];
	onChange?: (value: string[]) => void;
}

const TransferWrapper: FC<TransferProps> = ({ value = [], onChange }): ReactElement => {
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const { data } = useQuery('tile-groups', getTileGroups);
	const groups: RecordType[] | undefined = data?.map((x) => {
		return { key: '' + x.id, title: x.title };
	});

	const onGroupChange = (nTargetKeys: string[]): void => {
		onChange?.(nTargetKeys);
	};

	const onGroupSelectChange = (source: string[], target: string[]): void => {
		setSelectedGroups([...source, ...target]);
	};

	return (
		<Transfer
			dataSource={groups}
			targetKeys={value}
			selectedKeys={selectedGroups}
			onChange={onGroupChange}
			onSelectChange={onGroupSelectChange}
			render={(item) => item.title}
			oneWay
			showSearch
		/>
	);
};

export default ConfigLayoutColumn;
