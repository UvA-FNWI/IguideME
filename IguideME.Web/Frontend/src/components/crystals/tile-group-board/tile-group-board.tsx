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
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import Loading from '@/components/particles/loading';
import { type Tile, type TileGroup } from '@/types/tile';
import EditTile from '@/components/crystals/edit-tile/edit-tile';
import TileView from '@/components/crystals/tile-view/tile-view';
import TileGroupView from '@/components/crystals/tile-group/tile-group';
import { getTileGroups, patchTileGroupOrder, postTileGroup } from '@/api/tiles';
import { DrawerContext } from './contexts';
import Swal from 'sweetalert2';

const TileGroupBoard: FC = (): ReactElement => {
	const { data, isFetching } = useQuery('tile-groups', getTileGroups);
	const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
	const [activeTile, setActiveTile] = useState<Tile | null>(null);
	const [editTile, setEditTile] = useState<Tile | null>(null);

	const tilegroups = data?.sort((a, b) => a.position - b.position);

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
		console.log('test', event.active.id);
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

		if (tilegroups === undefined) return;

		const activeID = active.id;
		const overID = over.id;
		if (activeID === overID) return;

		// if (active.data.current === undefined) return;
		// if (over.data.current === undefined) return;

		// const activegroup = active.data.current.group;
		// const overgroup = over.data.current.group;

		const ids = tilegroups.map((group) => group.id);
		const activeIndex = ids.findIndex((id) => id === +activeID - 1);
		const overIndex = ids.findIndex((id) => id === +overID - 1);
		updateTileGroupOrder(arrayMove(ids, activeIndex, overIndex));
	}
};

export default TileGroupBoard;
