import { useMemo, type FC, type ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	useSensors,
	useSensor,
	PointerSensor,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import Loading from '@/components/particles/loading';
import { type Tile, type TileGroup } from '@/types/tile';
import EditTile from '@/components/crystals/edit-tile/edit-tile';
import TileView from '@/components/crystals/tile-view/tile-view';
import TileGroupView from '@/components/crystals/tile-group/tile-group';
import { getTileGroups, patchTileGroup, postTileGroup } from '@/api/tiles';
import { DrawerContext } from './contexts';

const TileGroupBoard: FC = (): ReactElement => {
	const { data: tilegroups } = useQuery('tile-groups', getTileGroups);
	const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
	const [activeTile, setActiveTile] = useState<Tile | null>(null);
	const [editTile, setEditTile] = useState<Tile | null>(null);

	const queryClient = useQueryClient();
	const { mutate: postGroup } = useMutation({
		mutationFn: postTileGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const { mutate: patchGroup } = useMutation({
		mutationFn: patchTileGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const groupIds = useMemo(
		() => (tilegroups === undefined ? [] : tilegroups.map((group) => group.position)),
		[tilegroups],
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 20,
			},
		}),
	);

	if (tilegroups === undefined) {
		return <Loading />;
	}

	return (
		<DrawerContext.Provider value={{ editTile, setEditTile }}>
			<div className="tileGroupBoard">
				<Drawer
					title={'Editing: ' + editTile?.title}
					placement="right"
					closable
					onClose={() => {
						setEditTile(null);
					}}
					open={editTile !== null}
					rootStyle={{ position: 'absolute' }}
					getContainer={() => {
						return document.getElementsByClassName('adminContent')[0];
					}}
				>
					{editTile === null ? '' : <EditTile tile={editTile} />}
				</Drawer>
				<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
					<div>
						<SortableContext items={groupIds}>
							{tilegroups.map((group, index) => (
								<div key={index}>
									<TileGroupView group={group} />
								</div>
							))}
						</SortableContext>
						<Button
							type="dashed"
							onClick={() => {
								postGroup({ title: 'TileGroup', id: -1, position: tilegroups.length + 1 });
							}}
							block
							icon={<PlusOutlined />}
						>
							New Group
						</Button>
					</div>
					{createPortal(
						<DragOverlay>
							{activeGroup !== null && <TileGroupView group={activeGroup} />}
							{activeTile !== null && <TileView tile={activeTile} />}
						</DragOverlay>,
						document.body,
					)}
				</DndContext>
			</div>
		</DrawerContext.Provider>
	);

	function onDragStart(event: DragStartEvent): void {
		if (event.active.data.current?.type === 'Group') {
			setActiveGroup(event.active.data.current.group);
		}
		if (event.active.data.current?.type === 'Tile') {
			setActiveTile(event.active.data.current.tile);
		}
	}

	function onDragEnd(event: DragEndEvent): void {
		setActiveGroup(null);
		setActiveTile(null);
		const { active, over } = event;
		if (over === null) return;

		const activeGroupId = active.id;
		const overGroupId = over.id;
		if (activeGroupId === overGroupId) return;

		if (active.data.current === undefined) return;
		if (over.data.current === undefined) return;

		patchGroup({ id: active.data.current.group.id, position: +overGroupId });
		patchGroup({ id: over.data.current.group.id, position: +activeGroupId });
	}
};

export default TileGroupBoard;
