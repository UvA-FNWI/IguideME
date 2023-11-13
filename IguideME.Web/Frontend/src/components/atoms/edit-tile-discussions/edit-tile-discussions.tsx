import { getTopics } from '@/api/entries';
import Loading from '@/components/particles/loading';
import { type Discussion, type TileEntry } from '@/types/tile';
import { DeleteFilled } from '@ant-design/icons';
import { Form, Row, Select, Table } from 'antd';
import { useState, type FC, type ReactElement } from 'react';
import { useQuery } from 'react-query';

const { Item } = Form;

const EditTileDiscussions: FC = (): ReactElement => {
	const { data: topics } = useQuery('topics', getTopics);

	console.log('topics', topics);
	return (
		<div>
			<Row style={{ marginTop: '1em' }}>
				<p>Discussions:</p>
				<Item name="entries" style={{ width: '100%' }}>
					{topics === undefined ? <Loading /> : <SelectTopics topics={topics} />}
				</Item>
			</Row>
		</div>
	);
};

interface SelectProps {
	value?: TileEntry[];
	onChange?: (value: TileEntry[]) => void;
	topics: Discussion[];
}

const SelectTopics: FC<SelectProps> = ({ value: entries, onChange, topics }): ReactElement => {
	if (entries === undefined) {
		return <Loading />;
	}

	const [selectedTopics, setSelectedTopics] = useState<number[]>(entries.map((entry) => entry.content_id));
	const [open, setOpen] = useState<boolean>(false);
	const unselectedTopics: Discussion[] = [...topics.values()].filter((top) => {
		return !selectedTopics.some((sel) => sel === top.id);
	});

	const onSelectChange = (selected: number[]): void => {
		setOpen(false);
		setSelectedTopics(selected);
		onChange?.(
			selected.map((id) => {
				const top = topics.find((disc) => disc.id === id);
				return {
					title: top!.title,
					tile_id: -1, // Set the correct id on the backend
					weight: 0,
					content_id: id,
				};
			}),
		);
	};

	const removeEntry = (rid: number): void => {
		setSelectedTopics(selectedTopics.filter((id) => id !== rid));
		onChange?.(entries.filter((e) => e.content_id !== rid));
	};

	const format = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short', timeStyle: 'short' });

	return (
		<div>
			<Table
				columns={[
					{
						title: 'Name',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: 'Author',
						dataIndex: 'author',
						key: 'author',
						align: 'center',
						render: (_: string, entry: TileEntry) => {
							const topic = topics.find((top) => top.id === entry.content_id);
							return topic?.author;
						},
					},
					{
						title: 'Date',
						dataIndex: 'date',
						key: 'date',
						align: 'center',
						render: (_: string, entry: TileEntry) => {
							const topic = topics.find((top) => top.id === entry.content_id);
							if (topic !== undefined) return format.format(new Date(topic.date * 1000));
						},
					},
					{
						title: '',
						dataIndex: 'action',
						key: 'action',
						align: 'center',
						render: (_: string, entry: TileEntry) => {
							return (
								<DeleteFilled
									onClick={() => {
										removeEntry(entry.content_id);
									}}
								/>
							);
						},
					},
				]}
				pagination={false}
				dataSource={entries.sort((a, b) => a.title.localeCompare(b.title))}
				rowKey="content_id"
			/>

			<Select
				value={selectedTopics}
				mode="multiple"
				options={unselectedTopics?.map((ass) => ({
					value: ass.id,
					label: ass.title,
				}))}
				open={open}
				onDropdownVisibleChange={(visible) => {
					setOpen(visible);
				}}
				onChange={onSelectChange}
				filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
				tagRender={() => <></>}
				onInputKeyDown={(event) => {
					if (event.key === 'Backspace') {
						event.stopPropagation();
					}
				}}
			/>
		</div>
	);
};

export default EditTileDiscussions;
