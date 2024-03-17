import { Col, Divider, InputNumber, Row, Slider, Transfer } from 'antd';
import { type FC, type ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { DeleteFilled } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { getTileGroups } from '@/api/tiles';

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
	key: number;
	title: string;
}

const ConfigLayoutColumn: FC<Props> = ({ column, remove, parentOnChange }): ReactElement => {
	const [width, setWidth] = useState<number>(column.width);
	const [targetGroups, setGroups] = useState<string[]>(column.groups.map(String));
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const { data } = useQuery('tile-groups', getTileGroups);
	const groups: RecordType[] | undefined = data?.map((x) => {
		return { key: x.id, title: x.title };
	});

	const onChange = (): void => {
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
		column.groups = targetKeys.map(key => +key);
		onChange();
	};

	if (isDragging) {
		return (
      <div
        className="rounded-md w-[425px] h-[360px] p-3 m-2 bg-white shadow-statusCard"
        ref={setNodeRef}
        style={style}
      />
    );
	}
	return (
		<div
      className="rounded-md w-[425px] h-[360px] p-3 m-2 bg-white shadow-statusCard"
      ref={setNodeRef}
      style={style}
    >
			<Row
        className='cursor-grab'
        justify={'space-between'}
        {...attributes}
        {...listeners}
      >
				<Col>
					<h3 className='text-lg'>Column</h3>
				</Col>
				<Col>
					<DeleteFilled onClick={() => remove?.(column.id)} />
				</Col>
			</Row>

			<Divider className='my-[10px] mr-[10px]' />

			<Row align="middle" justify="space-between">
				<Col span={3}>
					<span>Width:</span>
				</Col>
				<Col span={15}>
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
				<Col span={4}>
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
            className='w-[90%]'
					/>
				</Col>
			</Row>

			<Divider className='my-[10px] mr-[10px]' />
			<div className='mb-[10px]'>Tile Groups:</div>

			<Row justify="center">
				<Transfer
					dataSource={groups?.map((value) => ({ ...value, key: value.key.toString() }))}
					targetKeys={targetGroups}
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
