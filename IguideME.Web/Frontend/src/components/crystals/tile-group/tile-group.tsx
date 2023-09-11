import { useState, type FC, type ReactElement } from 'react';
import { type TileGroup } from '@/types/tile';

import './style.scss';
import { Col, Divider, Input, Row } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from 'react-query';
import { deleteTileGroup, patchTileGroup } from '@/api/tiles';
import { DeleteFilled } from '@ant-design/icons';

interface Props {
	group: TileGroup;
}
const TileGroupView: FC<Props> = ({ group }): ReactElement => {
	const [editing, setEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(group.title);
	const queryClient = useQueryClient();
	const { mutate: patchGroup } = useMutation({
		mutationFn: patchTileGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const { mutate: deleteGroup } = useMutation({
		mutationFn: deleteTileGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: group.position,
		data: {
			type: 'Group',
			group,
		},
		disabled: editing,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	if (isDragging) {
		return <div className="tileGroup" ref={setNodeRef} style={style}></div>;
	}
	return (
		<div className="tileGroup" ref={setNodeRef} style={style}>
			<Row align="middle" justify="space-between" {...attributes} {...listeners} style={{ cursor: 'grab' }}>
				<Col style={{ cursor: 'text' }}>
					<h2
						onClick={() => {
							setEditing(true);
						}}
						style={{ padding: 5 }}
					>
						{!editing && group.title}
						{editing && (
							<Input
								value={title}
								autoFocus
								onBlur={() => {
									setEditing(false);
								}}
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key !== 'Enter') return;
									patchGroup({ id: group.id, title });
									setEditing(false);
								}}
							/>
						)}
					</h2>
				</Col>
				<Col>
					<DeleteFilled
						onClick={() => {
							deleteGroup(group.id);
						}}
						style={{ padding: 5 }}
					/>
				</Col>
			</Row>

			<Divider style={{ margin: '5px 0px 8px 0px' }} />
		</div>
	);
};

export default TileGroupView;
