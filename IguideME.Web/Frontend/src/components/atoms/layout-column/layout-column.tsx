import { Col, Divider, InputNumber, Row, Slider, Transfer } from 'antd';
import { type FC, type ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { DeleteFilled } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { getTileGroups } from '@/api/tiles';

import './style.scss';
import { type LayoutColumn } from '@/types/tile';

const MIN_WIDTH = 1;
const MAX_WIDTH = 100;
const formatter = (value: number | undefined): string => (value !== undefined ? `${value}%` : '');

interface Props {
	column: LayoutColumn;
	remove?: (index: number) => void;
	parentOnChange?: (column: LayoutColumn) => void;
}

interface RecordType {
	key: string;
	title: string;
}

const ConfigLayoutColumn: FC<Props> = ({ column, remove, parentOnChange }): ReactElement => {
	const [width, setWidth] = useState<number>(column.width);
	const [targetGroups, setGroups] = useState<string[]>(column.groups);
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const { data } = useQuery('tile-groups', getTileGroups);
	const groups: RecordType[] | undefined = data?.map((x) => {
		return { key: x.id, title: x.title };
	});

	const onChange = (): void => {
		console.log('column', column.width);
		parentOnChange?.(column);
	};

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: column !== undefined ? column.id : 0,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const onGroupSelectChange = (source: string[], target: string[]): void => {
		setSelectedGroups([...source, ...target]);
	};

	const onGroupChange = (targetKeys: string[]): void => {
		setGroups(targetKeys);
		column.groups = targetKeys;
		onChange();
	};

	if (isDragging) {
		return <div ref={setNodeRef} style={style} className="LayoutColumn"></div>;
	}

	return (
		<div className="LayoutColumn" ref={setNodeRef} style={style}>
			<Row justify={'space-between'} {...attributes} {...listeners} style={{ cursor: 'grab' }}>
				<Col>
					<h3>Column</h3>
				</Col>
				<Col>
					<DeleteFilled onClick={() => remove?.(column.id)} />
				</Col>
			</Row>

			<Divider style={{ margin: '10px', marginLeft: 0 }} />

			<Row align="middle" justify="space-between">
				<Col span={3}>
					<span>Width:</span>
				</Col>
				<Col span={14}>
					<Slider
						min={MIN_WIDTH}
						max={MAX_WIDTH}
						value={width}
						onChange={(value) => {
							setWidth(value);
							column.width = value;
							onChange();
						}}
						tooltip={{ formatter }}
					/>
				</Col>
				<Col span={7}>
					<InputNumber
						min={MIN_WIDTH}
						max={MAX_WIDTH}
						value={width}
						onChange={(value) => {
							setWidth(value ?? MIN_WIDTH);
							column.width = value ?? MIN_WIDTH;
							onChange();
						}}
						formatter={formatter}
					/>
				</Col>
			</Row>

			<Divider style={{ margin: '10px', marginLeft: 0 }} />
			<div style={{ marginBottom: '10px' }}>Tile Groups:</div>

			<Row justify="center">
				<Transfer
					dataSource={groups}
					targetKeys={targetGroups.map((id) => id)}
					selectedKeys={selectedGroups}
					onChange={onGroupChange}
					onSelectChange={onGroupSelectChange}
					render={(item) => item.title}
					oneWay
					showSearch
				/>
			</Row>
		</div>
	);
};

export default ConfigLayoutColumn;
