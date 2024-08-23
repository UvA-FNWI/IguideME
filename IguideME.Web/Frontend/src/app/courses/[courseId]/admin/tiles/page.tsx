import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { getTileGroups, getTiles } from '@/api/tiles';
import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';
import type { Tile, TileGroup } from '@/types/tile';

import { DndTileBoard } from './_components/dnd-tile-board/dnd-tile-board';

export default async function AdminTiles(): Promise<ReactElement> {
  let isError = false;
  let tileGroups: TileGroup[] | undefined;
  let tiles: Tile[] | undefined;

  try {
    tileGroups = await getTileGroups();
    tiles = await getTiles();
  } catch {
    isError = true;
  }

  return (
    <>
      <AdminHeader title='Tiles' subtitle='Configure the tiles and tile groups.' />
      {isError || !tileGroups || !tiles ?
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <CircleAlert className='h-12 w-12 stroke-destructive' />
          <i className='text-base text-destructive'>Error: Tiles could not be loaded</i>
        </div>
      : <DndTileBoard tileGroupsData={tileGroups} tilesData={tiles} />}
    </>
  );
}
