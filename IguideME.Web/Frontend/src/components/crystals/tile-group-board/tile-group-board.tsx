import { useMemo, type FC, type ReactElement, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import Loading from '@/components/particles/loading';
import { getTileGroups, patchTileGroup, postTileGroup } from '@/api/tiles';
import TileGroupView from '@/components/crystals/tile-group/tile-group';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
import { type TileGroup } from '@/types/tile';
import { createPortal } from 'react-dom';

const TileGroupBoard: FC = (): ReactElement => {
	const { data: tilegroups } = useQuery('tile-groups', getTileGroups);
	if (tilegroups === undefined) {
		return <Loading />;
	}

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

	const [activeGroup, setActiveGroup] = useState<TileGroup | null>(null);
	const groupIds = useMemo(() => tilegroups.map((group) => group.position), [tilegroups]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 20,
			},
		}),
	);

	return (
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
						postGroup({ title: 'TileGroup', id: -1, position: tilegroups.length });
					}}
					block
					icon={<PlusOutlined />}
				>
					Add Group
				</Button>
			</div>
			{createPortal(
				<DragOverlay>{activeGroup !== null && <TileGroupView group={activeGroup} />}</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);

	function onDragStart(event: DragStartEvent): void {
		if (event.active.data.current?.type === 'Group') {
			setActiveGroup(event.active.data.current.group);
		}
	}

	function onDragEnd(event: DragEndEvent): void {
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
