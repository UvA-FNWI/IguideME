import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { getGroupTiles } from '@/api/tiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tile, TileGroup } from '@/types/tile';

import { StudentDashboardTileView } from './student-dashboard-tile-view';

export async function StudentDashboardTileGroup({ group }: { group: TileGroup }): Promise<ReactElement> {
  let isError = false;
  let tiles: Tile[] | undefined;

  try {
    tiles = await getGroupTiles(group.id);
  } catch {
    isError = true;
  }

  return (
    <Card className='flex h-full w-full flex-col'>
      <CardHeader className='flex-shrink-0 text-center'>
        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap'>{group.title}</CardTitle>
      </CardHeader>
      <CardContent className='flex w-full grow flex-wrap items-center justify-center gap-4'>
        {isError || !tiles ?
          <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: Tiles could not be loaded</i>
          </div>
        : tiles.map((tile) => {
            if (tile.title === 'Hidden') return null;

            return <StudentDashboardTileView key={tile.id} tile={tile} />;
          })
        }
      </CardContent>
    </Card>
  );
}
