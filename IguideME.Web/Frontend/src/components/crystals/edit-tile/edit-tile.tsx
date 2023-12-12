import { deleteTile, patchTile } from '@/api/tiles';
import { TileType, type Tile } from '@/types/tile';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useContext, type FC, type ReactElement, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { DrawerContext } from '../tile-group-board/contexts';
import Swal from 'sweetalert2';
import { BellTwoTone, CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';
import EditTileAssignments from '@/components/atoms/edit-tile-assignments/edit-tile-assignments';
import EditTileDiscussions from '@/components/atoms/edit-tile-discussions/edit-tile-discussions';
import EditTileGoals from '@/components/atoms/edit-tile-goals/edit-tile-goals';
import { useForm, useWatch } from 'antd/es/form/Form';

interface Props {
	tile: Tile;
}

const GREEN = 'rgb(55, 212, 63)';
const RED = 'rgb(252, 69, 3)';

const { Item } = Form;

const EditTile: FC<Props> = ({ tile }): ReactElement => {
	const [form] = useForm<Tile>();
	const queryClient = useQueryClient();
	const { setEditTile } = useContext(DrawerContext);

	const { mutate: saveTile } = useMutation({
		mutationFn: patchTile,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tiles');
		},
	});

	const { mutate: removeTile } = useMutation({
		mutationFn: deleteTile,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tiles');
		},
	});

	return (
		<Form<Tile>
			form={form}
			name="edit_tile_form"
			initialValues={tile}
			onFinish={(data: Tile) => {
				setEditTile(null);
				saveTile(data);
			}}
			requiredMark={false}
		>
			<Item name="id" hidden></Item>
			<Item name="group_id" hidden></Item>
			<Item name="position" hidden></Item>
			<Row align="middle" style={{ height: '3em' }}>
				<Col span={4}>
					<div style={{ height: '100%' }}>Title:</div>
				</Col>
				<Col span={8}>
					<Item name="title" rules={[{ required: true, message: 'Please insert a title for the tile' }]} noStyle>
						<Input style={{ width: '100%' }} />
					</Item>
				</Col>
				<Col span={4} offset={8}>
					<Space>
						<Item name="notifications" noStyle>
							<Notification />
						</Item>
						<Item name="visible" noStyle>
							<Visible />
						</Item>
					</Space>
				</Col>
			</Row>

			<Row align="middle" style={{ height: '3em' }}>
				<Col span={4}>
					<div style={{ height: '100%' }}>Type:</div>
				</Col>
				<Col span={8}>
					<Item name="type" noStyle>
						<Select
							style={{ width: '100%' }}
							options={[
								{ value: TileType.assignments, label: 'Assignments' },
								{ value: TileType.discussions, label: 'Discussions' },
								{ value: TileType.learning_outcomes, label: 'Learning Outcomes' },
							]}
						/>
					</Item>
				</Col>
			</Row>
			{renderTypeSettings()}
			<Row>
				<Col>
					<Item style={{ margin: '0px 10px 5px 0px' }}>
						<Button type="primary" htmlType="submit">
							Save
						</Button>
					</Item>
				</Col>
				<Col>
					<Item style={{ margin: '0px 10px 5px 0px' }}>
						<Button
							type="primary"
							danger
							onClick={() => {
								void Swal.fire({
									title: 'Warning: This will permanently delete the tile!',
									icon: 'warning',
									focusCancel: true,
									showCancelButton: true,
									confirmButtonText: 'Delete',
									cancelButtonText: 'Cancel',
									customClass: {},
								}).then((result) => {
									if (result.isConfirmed) {
										setEditTile(null);
										removeTile(tile.id);
									}
								});
							}}
						>
							Delete
						</Button>
					</Item>
				</Col>
			</Row>
		</Form>
	);

	function renderTypeSettings(): ReactElement {
		// TODO: delete entries when changing types.
		const type = useWatch('type', form);
		switch (type) {
			case TileType.assignments:
				return <EditTileAssignments></EditTileAssignments>;
			case TileType.discussions:
				return <EditTileDiscussions></EditTileDiscussions>;
			case TileType.learning_outcomes:
				return <EditTileGoals></EditTileGoals>;
		}
	}
};

const Notification: FC<{ value?: boolean; onChange?: (value: boolean) => void }> = ({
	value,
	onChange,
}): ReactElement => {
	const [notifications, setNotifications] = useState<boolean | undefined>(value);

	return (
		<Button
			shape="circle"
			icon={<BellTwoTone twoToneColor={notifications === true ? GREEN : RED} />}
			onClick={() => {
				if (notifications === undefined) return;
				setNotifications(!notifications);
				onChange?.(!notifications);
			}}
		/>
	);
};

const Visible: FC<{ value?: boolean; onChange?: (value: boolean) => void }> = ({ value, onChange }): ReactElement => {
	const [visible, setVisible] = useState<boolean | undefined>(value);

	return (
		<Button
			shape="circle"
			icon={
				visible === true ? (
					<CheckCircleTwoTone twoToneColor={GREEN} style={{ fontSize: '9pt' }} />
				) : (
					<StopTwoTone twoToneColor={RED} style={{ fontSize: '9pt' }} />
				)
			}
			onClick={() => {
				if (visible === undefined) return;
				setVisible(!visible);
				onChange?.(!visible);
			}}
		/>
	);
};

export default EditTile;
