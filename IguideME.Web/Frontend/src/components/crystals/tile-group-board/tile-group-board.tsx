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
	type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import Loading from '@/components/particles/loading';
import { type Tile, type TileGroup } from '@/types/tile';
import EditTile from '@/components/crystals/edit-tile/edit-tile';
import TileView from '@/components/crystals/tile-view/tile-view';
import TileGroupView from '@/components/crystals/tile-group/tile-group';
import { getTileGroups, getTiles, patchTile, patchTileGroupOrder, patchTileOrder, postTileGroup } from '@/api/tiles';
import { DrawerContext } from './contexts';
import Swal from 'sweetalert2';

const TileGroupBoard: FC = (): ReactElement => {
	const { data: tilegroups, isFetching } = useQuery('tile-groups', getTileGroups);
	const { data: tiles } = useQuery('tiles', getTiles);
	const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
	const [activeTile, setActiveTile] = useState<Tile | null>(null);
	const [editTile, setEditTile] = useState<Tile | null>(null);
	const [move, setMove] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const { mutate: postGroup } = useMutation({
		mutationFn: postTileGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const { mutate: updateTileGroupOrder } = useMutation({
		mutationFn: patchTileGroupOrder,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tile-groups');
		},
	});

	const { mutate: updateTileOrder } = useMutation({
		mutationFn: patchTileOrder,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tiles');
		},
	});

	const { mutate: updateTile } = useMutation({
		mutationFn: patchTile,
		onSuccess: async () => {
			await queryClient.invalidateQueries('tiles');
		},
	});

	// Add 1 to the id's because dnd doesn't like 0 as an id.
	const groupIds = useMemo(
		() => (tilegroups === undefined ? [] : tilegroups.map((group) => group.id + 1)),
		[tilegroups],
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 20,
			},
		}),
	);

	if (tilegroups === undefined || isFetching) {
		return <Loading />;
	}

	return (
		<DrawerContext.Provider value={{ editTile, setEditTile }}>
			<div className="tileGroupBoard">
				<Drawer
					title={'Editing: ' + editTile?.title}
					placement="right"
					closable
					width="45vw"
					onClose={() => {
						void Swal.fire({
							title: 'Warning: any unsaved changes will be deleted!',
							icon: 'warning',
							focusCancel: true,
							showCancelButton: true,
							confirmButtonText: 'Close',
							cancelButtonText: 'Cancel',
							customClass: {},
						}).then((result) => {
							if (result.isConfirmed) {
								setEditTile(null);
							}
						});
					}}
					open={editTile !== null}
					rootStyle={{ position: 'absolute' }}
					getContainer={() => {
						return document.getElementsByClassName('adminContent')[0];
					}}
				>
					{editTile === null ? '' : <EditTile tile={editTile} />}
				</Drawer>
				<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
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
							{activeTile !== null && <TileView tile={activeTile} move={move} />}
						</DragOverlay>,
						document.body,
					)}
				</DndContext>
			</div>
		</DrawerContext.Provider>
	);

	function onDragStart(event: DragStartEvent): void {
		switch (event.active.data.current?.type) {
			case 'Group':
				setActiveGroup(event.active.data.current.group);
				return;
			case 'Tile':
				setActiveTile(event.active.data.current.tile);
		}
	}

	function onDragOver(event: DragOverEvent): void {
		setMove(false);

		const { active, over } = event;
		if (over === null) return;

		const activeID = active.id;
		const overID = over.id;
		if (activeID === overID) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		if (activeData === undefined) return;
		if (overData === undefined) return;
		if (activeData.type === 'Group') return;

		if (activeData.type === 'Tile') {
			if (overData.type === 'Group' && activeData.tile.group_id === +overID - 1) return;
			if (overData.type === 'Tile' && activeData.tile.group_id === overData.tile.group_id) return;
			setMove(true);
		}
	}

	function onDragEnd(event: DragEndEvent): void {
		// TODO: refactor to separate smaller functions and comment.
		setActiveGroup(null);
		setActiveTile(null);
		setMove(false);
		const { active, over } = event;
		if (over === null) return;

		const activeID = active.id;
		const overID = over.id;
		if (activeID === overID) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		if (activeData === undefined) return;
		if (overData === undefined) return;

		// Handle dropping of tile groups and save new order.
		if (activeData.type === 'Group' && tilegroups !== undefined) {
			const ids = tilegroups.map((group) => group.id);
			const activeIndex = ids.findIndex((id) => id === +activeID - 1);
			const overIndex = ids.findIndex((id) => id === +overID - 1);
			updateTileGroupOrder(arrayMove(ids, activeIndex, overIndex));
		}

		// Handle dropping of tiles.
		if (activeData.type === 'Tile' && tiles !== undefined) {
			// When dropping a tile into a new group we move the tile to the end of that group.
			if (overData.type === 'Group' && activeData.tile.group_id !== +overID - 1) {
				const gtiles = tiles.filter((tile) => tile.group_id === +overID - 1);
				// Set the position of the tile to the last of the new group
				updateTile({
					...activeData.tile,
					group_id: over.id,
					position: (gtiles.length > 0 ? gtiles[gtiles.length - 1].position : 0) + 1,
				});
			}
			// If we're on top of another tile we check if the tile is in the same group.
			if (overData.type === 'Tile') {
				// Sort if in same group
				if (activeData.tile.group_id === overData.tile.group_id) {
					const ids = tiles.flatMap((tile) => (tile.group_id === overData.tile.group_id ? [tile.id] : []));
					const activeIndex = ids.findIndex((id) => id === +(activeID as string).substring(1) - 1);
					const overIndex = ids.findIndex((id) => id === +(overID as string).substring(1) - 1);
					updateTileOrder(arrayMove(ids, activeIndex, overIndex));
					// Move the tile otherwise.
				} else {
					const gtiles = tiles.filter((tile) => tile.group_id === overData.tile.group_id);
					// Set the position of the tile to the last of the new group
					updateTile({
						...activeData.tile,
						group_id: over.id,
						position: (gtiles.length > 0 ? gtiles[gtiles.length - 1].position : 0) + 1,
					});
				}
			}
		}
	}
};

export default TileGroupBoard;
