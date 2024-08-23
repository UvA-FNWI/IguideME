import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useTileTypeContext } from '@/app/courses/[courseId]/admin/tiles/_components/dnd-tile-board/tile-type-store';
import { type Tile, TileType } from '@/types/tile';

import { EditAssignmentTile } from './assignment/edit-assignment-tile';
import { EditDiscussionTile } from './discussion/edit-discussion-tile';
import { EditLearningOutcomeTile } from './learning-outcome/edit-learning-outcome-tile';

export function DndTileItemEditWrapper({
  setHasChanged,
  setIsSheetOpen,
  tile,
}: {
  setHasChanged: Dispatch<SetStateAction<boolean>>;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  tile: Tile;
}): ReactElement {
  const { tileType } = useTileTypeContext(useShallow((state) => ({ tileType: state.tileType })));
  return (
    tileType === TileType.Assignments ?
      <EditAssignmentTile setHasChanged={setHasChanged} setIsSheetOpen={setIsSheetOpen} tile={tile} />
    : tileType === TileType.Discussions ?
      <EditDiscussionTile setHasChanged={setHasChanged} setIsSheetOpen={setIsSheetOpen} tile={tile} />
    : <EditLearningOutcomeTile setHasChanged={setHasChanged} setIsSheetOpen={setIsSheetOpen} tile={tile} />
  );
}
