'use client';

import { type ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  type Active,
  type Announcements,
  type DataRef,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  type Over,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { patchTileLayout, postTileGroup } from '@/api/tiles';
import { Button } from '@/components/ui/button';
import { useActionStatus } from '@/hooks/use-action-status';
import { useWarnIfUnsavedChanges } from '@/hooks/use-warn-if-unsaved-changes';
import type { Tile, TileGroup } from '@/types/tile';

import { DndTileColumn, DndTileColumnWrapper } from './dnd-tile-column';
import { DndTileItem } from './dnd-tile-item';
import { coordinateGetter } from './multiple-containers-keyboard-preset';

interface DndTileBoardProps {
  tilesData: Tile[];
  tileGroupsData: TileGroup[];
}

export function DndTileBoard({ tilesData, tileGroupsData }: DndTileBoardProps): ReactElement {
  interface TileGroupDragData {
    type: 'TileGroup';
    tileGroup: TileGroup;
  }

  interface TileDragData {
    type: 'Tile';
    tile: Tile;
  }

  interface DndSortable {
    containerId: string;
    index: number;
    tiles?: Tile[];
    tileGroups?: TileGroup[];
  }

  const [activeTileGroup, setActiveTileGroup] = useState<TileGroup | null>(null);
  const [tileGroups, setTileGroups] = useState<TileGroup[]>(tileGroupsData);
  const tileGroupIds = useMemo(() => tileGroups.map((col) => `TileGroup-${String(col.id)}`), [tileGroups]);
  const pickedUpTileGroup = useRef<number | null>(null);

  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [tiles, setTiles] = useState<Tile[]>(tilesData);

  const tileFilterFunction = useCallback((tileGroup: TileGroup, tile: Tile) => {
    return tile.group_id === tileGroup.id;
  }, []);

  /**
   * Checks if the given entry has draggable data of type 'TileGroup' or 'Tile'.
   *
   * @param entry - The entry to check.
   * @returns - True if the entry has draggable data of type 'TileGroup' or 'Tile', false otherwise.
   */
  function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined,
  ): entry is T & { data: DataRef<TileGroupDragData | TileDragData> } {
    return Boolean(entry && (entry.data.current?.type === 'TileGroup' || entry.data.current?.type === 'Tile'));
  }

  /**
   * Retrieves the data of the dragging Tile, including Tiles in the TileGroup, Tile position, and the TileGroup itself.
   *
   * @param tileId - The unique identifier of the task.
   * @param TileGroupId - The unique identifier of the TileGroup.
   * @returns - The data of the dragging Tile.
   */
  function getDraggingTileData(
    tileId: UniqueIdentifier,
    tileGroupId: number,
  ): {
    tilesInTileGroup: Tile[];
    tilePosition: number;
    tileGroup: TileGroup | undefined;
  } {
    const tilesInTileGroup = tiles.filter((t) => t.id === tileGroupId);
    return {
      tilesInTileGroup,
      tilePosition: tilesInTileGroup.findIndex((task) => task.id === tileId),
      tileGroup: tileGroups.find((tileGroup) => tileGroup.id === tileGroupId),
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;

      if (active.data.current?.type === 'TileGroup') {
        const startTileGroupIdx = tileGroupIds.findIndex((id) => id === active.id);
        const startTileGroup = tileGroups[startTileGroupIdx];
        return `Picked up TileGroup ${String(startTileGroup?.title)} at position: ${String(startTileGroupIdx + 1)} of ${String(tileGroupIds.length)}`;
      } else if (active.data.current?.type === 'Tile') {
        pickedUpTileGroup.current = active.data.current.tile.id;
        const { tilesInTileGroup, tilePosition, tileGroup } = getDraggingTileData(
          active.id,
          Number(pickedUpTileGroup.current),
        );
        return `Picked up tile ${String(active.data.current.tile.title)} at position: ${String(tilePosition + 1)} of ${String(
          tilesInTileGroup.length,
        )} in TileGroup ${String(tileGroup?.title)}`;
      }
    },

    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (active.data.current?.type === 'TileGroup' && over.data.current?.type === 'TileGroup') {
        const overTileGroupIdx = tileGroupIds.findIndex((id) => id === over.id);
        return `TileGroup ${String(active.data.current.tileGroup.title)} was moved over ${String(
          over.data.current.tileGroup.title,
        )} at position ${String(overTileGroupIdx + 1)} of ${String(tileGroupIds.length)}`;
      } else if (active.data.current?.type === 'Tile' && over.data.current?.type === 'Tile') {
        const { tilesInTileGroup, tilePosition, tileGroup } = getDraggingTileData(
          over.id,
          Number(over.data.current.tile.id),
        );
        if (over.data.current.tile.id !== pickedUpTileGroup.current) {
          return `Tile ${String(active.data.current.tile.title)} was moved over TileGroup ${String(tileGroup?.title)} in position ${String(
            tilePosition + 1,
          )} of ${String(tilesInTileGroup.length)}`;
        }
        return `Tile was moved over position ${String(tilePosition + 1)} of ${String(tilesInTileGroup.length)} in TileGroup ${String(tileGroup?.title)}`;
      }
    },

    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTileGroup.current = null;
        return;
      }

      if (active.data.current?.type === 'TileGroup' && over.data.current?.type === 'TileGroup') {
        const overTileGroupPosition = tileGroupIds.findIndex((id) => id === over.id);

        return `TileGroup ${String(active.data.current.tileGroup.title)} was dropped into position ${String(overTileGroupPosition + 1)} of ${String(
          tileGroupIds.length,
        )}`;
      } else if (active.data.current?.type === 'Tile' && over.data.current?.type === 'Tile') {
        const { tilesInTileGroup, tilePosition, tileGroup } = getDraggingTileData(
          over.id,
          Number(over.data.current.tile.id),
        );
        if (over.data.current.tile.id !== pickedUpTileGroup.current) {
          return `Tile was dropped into TileGroup ${String(tileGroup?.title)} in position ${String(
            tilePosition + 1,
          )} of ${String(tilesInTileGroup.length)}`;
        }
        return `Tile was dropped into position ${String(tilePosition + 1)} of ${String(tilesInTileGroup.length)} in TileGroup ${String(tileGroup?.title)}`;
      }

      pickedUpTileGroup.current = null;
    },

    onDragCancel({ active }) {
      pickedUpTileGroup.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${String(active.data.current?.type)} cancelled.`;
    },
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  const [changes, setChanges] = useState<boolean>(false);
  useWarnIfUnsavedChanges(changes);

  const {
    mutate: addTileGroupMutation,
    status: TileGroupStatus,
    isPending: TileGroupPending,
  } = useMutation({ mutationFn: postTileGroup });

  const descriptionTileGroup = useMemo(() => {
    return {
      error: `The new tile group could not be added.`,
      success: `The new tile group has been successfully added.`,
    };
  }, []);

  useActionStatus({
    description: descriptionTileGroup,
    status: TileGroupStatus,
  });

  const descriptionLayout = useMemo(() => {
    return {
      error: `Layout changes could not be saved.`,
      success: `Layout changes have been successfully saved.`,
    };
  }, []);

  const {
    mutate: saveLayout,
    status: layoutStatus,
    isPending: layoutPending,
  } = useMutation({ mutationFn: patchTileLayout });
  useActionStatus({
    description: descriptionLayout,
    status: layoutStatus,
  });

  return (
    <>
      <div className='mb-4 flex w-full flex-wrap justify-end gap-2'>
        <Button
          className='flex w-44 gap-1 truncate'
          disabled={TileGroupPending}
          onClick={() => {
            addTileGroupMutation({
              title: 'TileGroup',
              id: -1,
              position: tileGroups.length,
            });
          }}
          variant='secondary'
        >
          <Plus />
          <span>Add new tile group</span>
        </Button>
        <Button
          className='w-44'
          disabled={!changes || layoutPending}
          onClick={() => {
            setChanges(false);
            saveLayout({
              tileGroupIds: tileGroups.map((tileGroup) => tileGroup.id),
              tileIds: tiles.map((tile) => tile.id),
            });
          }}
          type='submit'
        >
          Save layout changes
        </Button>
      </div>
      <DndContext
        accessibility={{ announcements }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        <DndTileColumnWrapper>
          <SortableContext items={tileGroupIds}>
            {tileGroups.map((col) => (
              <DndTileColumn
                tileGroup={col}
                tiles={tiles.filter((tile) => tileFilterFunction(col, tile))}
                key={`TileGroup-${String(col.id)}`}
              />
            ))}
          </SortableContext>
        </DndTileColumnWrapper>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {activeTileGroup ?
                <DndTileColumn
                  tileGroup={activeTileGroup}
                  tiles={tiles.filter((tile) => tileFilterFunction(activeTileGroup, tile))}
                />
              : null}
              {activeTile ?
                <DndTileItem tile={activeTile} isOverlay />
              : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </>
  );

  function handleDragStart(event: DragStartEvent): void {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;

    if (data?.type === 'TileGroup') setActiveTileGroup(data.tileGroup);
    else if (data?.type === 'Tile') setActiveTile(data.tile);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveTileGroup(null);
    setActiveTile(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    if (activeId === overId) return;
    setChanges(true);

    if (activeData?.type === 'TileGroup') {
      setTileGroups((cols) => {
        const activeTileGroupIndex = cols.findIndex((col) => String(col.id) === (activeId as string).split('-')[1]);
        const overTileGroupIndex = cols.findIndex((col) => String(col.id) === (overId as string).split('-')[1]);
        return arrayMove(cols, activeTileGroupIndex, overTileGroupIndex);
      });
    } else if (activeData?.type === 'Tile') {
      const overData = over.data.current as TileGroupDragData | TileDragData;

      // Check if overId is a TileGroup or an Tile in an other TileGroup
      let changeTileGroup = false;
      if (overData.type === 'TileGroup') {
        if (overData.tileGroup.id !== activeData.tile.group_id) changeTileGroup = true;
      } else if (overData.tile.group_id !== activeData.tile.group_id) {
        changeTileGroup = true;
      }

      if (changeTileGroup && 'sortable' in overData) {
        const overTileGroupIndex: number =
          'Tile' in overData ? (overData.Tile as Tile).group_id - 1 : (overData.sortable as DndSortable).index;

        setTiles((i) =>
          i.map((tile) => (tile === activeData.tile ? { ...tile, group_id: overTileGroupIndex + 1 } : tile)),
        );
      } else {
        setTiles((i) => {
          const activeIndex = i.findIndex((t) => String(t.id) === (activeId as string).split('-')[1]);
          const overIndex = i.findIndex((t) => String(t.id) === (overId as string).split('-')[1]);

          return arrayMove(i, activeIndex, overIndex);
        });
      }
    }
  }

  function handleDragOver(event: DragEndEvent): void {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type !== 'Tile') return;
    if (overData?.type === 'Tile') {
      setTiles((currentTiles) => {
        const activeId = Number((active.id as string).replace('tile-', ''));
        const overId = Number((over.id as string).replace('tile-', ''));
        const activeIndex = currentTiles.findIndex((t) => t.id === activeId);
        const overIndex = currentTiles.findIndex((t) => t.id === overId);

        return arrayMove(currentTiles, activeIndex, overIndex);
      });
    }

    if (
      overData?.type === 'TileGroup' ||
      (overData?.type === 'Tile' && activeData.tile.group_id !== overData.tile.group_id)
    ) {
      const overTileGroupIndex: number =
        'tile' in overData ? (overData.tile as Tile).group_id - 1 : (overData.sortable as DndSortable).index;

      setTiles((i) =>
        i.map((tile) => (tile === activeData.tile ? { ...tile, group_id: overTileGroupIndex + 1 } : tile)),
      );
    }
  }
}
