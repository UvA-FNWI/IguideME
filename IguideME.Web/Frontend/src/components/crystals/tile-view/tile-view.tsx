import { TileType, type Tile } from '@/types/tile';
import { useContext, type FC, type ReactElement } from 'react';
import { Col, Row, Space, Tooltip } from 'antd';
import {
	BellTwoTone,
	CarryOutOutlined,
	CheckCircleTwoTone,
	CommentOutlined,
	DeleteFilled,
	FormOutlined,
	StopTwoTone,
} from '@ant-design/icons';
import { deleteTile } from '@/api/tiles';
import { useMutation, useQueryClient } from 'react-query';
import { CSS } from '@dnd-kit/utilities';

import './style.scss';
import { useSortable } from '@dnd-kit/sortable';
import { DrawerContext } from '../tile-group-board/contexts';

const GREEN = 'rgb(55, 212, 63)';
const RED = 'red';

interface Props {
	tile: Tile;
}

const TileView: FC<Props> = ({ tile }): ReactElement => {
	const queryClient = useQueryClient();
	const { mutate: removeTile } = useMutation({
		mutationFn: deleteTile,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tiles');
		},
	});

	const { setEditTile } = useContext(DrawerContext);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: `${tile.group_id}:${tile.position}`,
		data: {
			type: 'Tile',
			tile,
		},
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const toggleVisible = (): void => {
		console.log('test');
	};

	if (isDragging) {
		return <div className="tile" ref={setNodeRef} style={style}></div>;
	}

	return (
		<div
			className="tile"
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => { setEditTile(tile); }}
		>
			<Row align="middle" justify={'space-between'} gutter={[10, 10]} style={{ marginBottom: '25px' }}>
				<Col>
					<Space align="center">
						<Tooltip title={<>This tile is {!tile.visible && <b>not </b>}visible on canvas</>}>
							{tile.visible ? (
								<CheckCircleTwoTone twoToneColor={GREEN} style={{ fontSize: '9pt' }} onClick={toggleVisible} />
							) : (
								<StopTwoTone twoToneColor={RED} style={{ fontSize: '9pt' }} onClick={toggleVisible} />
							)}
						</Tooltip>
						<h3 style={{ margin: 0, paddingTop: 2 }}>{tile.title}</h3>
					</Space>
				</Col>
				<Col>
					<DeleteFilled
						onClick={() => {
							removeTile(tile.id);
						}}
						style={{ paddingRight: 5 }}
					/>
				</Col>
			</Row>
			<Row justify="space-between" style={{ marginTop: '10 0' }}>
				<Col>
					<TileTypeView tileType={tile.type} />
				</Col>
			</Row>
			<Row align="middle" justify="space-between" style={{ paddingTop: 30 }}>
				<Col style={{ textAlign: 'center', height: 30 }}>
					{tile.type === TileType.assignments ? (
						<>
							<h4>Grading:</h4>
							<p>0-10</p>
						</>
					) : (
						''
					)}
				</Col>
				<Col style={{ paddingRight: 5 }}>
					<Tooltip
						title={
							<>
								Notifications are toggled <b>{tile.notifications ? 'on' : 'off'}</b>
							</>
						}
					>
						{/* TODO: toggle */}
						<BellTwoTone twoToneColor={tile.notifications ? GREEN : RED} onClick={toggleVisible} />
					</Tooltip>
				</Col>
			</Row>
		</div>
	);
};

const TileTypeView: FC<{ tileType: TileType }> = ({ tileType }): ReactElement => {
	switch (tileType) {
		case TileType.assignments:
			return (
				<Tooltip title="Assignment tiles group together assignments and quizzes completed by the students. These can be obtained from an LMS or uploaded manually">
					<Space align="center" size={3}>
						<FormOutlined /> <h4>Assignments</h4>
					</Space>
				</Tooltip>
			);
		case TileType.discussions:
			return (
				<Tooltip title="Discussion tiles give an overview of the messages the students have posted as well as the number of messages.">
					<Space align="center" size={3}>
						<CommentOutlined /> <h4>Discussions</h4>
					</Space>
				</Tooltip>
			);
		case TileType.learning_outcomes:
			return (
				<Tooltip title="Learning Goal tiles keep track of requirements or goals the students should complete during the course. Some examples of these are: the average of the partial exams must exceed X, students need to submit 10 discussions for participation, passing an extra assignments for honours, etc.">
					<Space align="center" size={3}>
						<CarryOutOutlined /> <h4>Learning Goals</h4>
					</Space>
				</Tooltip>
			);
	}
};

export default TileView;
