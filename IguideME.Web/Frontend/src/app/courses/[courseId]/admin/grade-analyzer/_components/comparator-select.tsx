import type { ReactElement } from 'react';

import { getTiles } from '@/api/tiles';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Tile, TileType } from '@/types/tile';

export async function ComparatorSelect(): Promise<ReactElement> {
  let isError = false;
  let tiles: Tile[] = [];

  try {
    tiles = await getTiles();
  } catch {
    isError = true;
  }

  if (isError) {
    return (
      <Select>
        <SelectTrigger className='flex-1 flex-grow' disabled>
          <SelectValue placeholder='Failed to load tiles' />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select>
      <SelectTrigger className='flex-1 flex-grow'>
        <SelectValue placeholder='Select a tile or an assignment' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tiles</SelectLabel>
          {tiles.map((tile) => (
            <SelectItem key={tile.id} value={String(tile.id)}>
              {tile.title}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Entries</SelectLabel>
          {tiles.reduce<ReactElement[]>((acc, tile) => {
            tile.entries.forEach((entry) => {
              if (acc.some((x) => x.key === `key-${String(entry.content_id)}`)) return;

              let key = '';
              switch (tile.type) {
                case TileType.Assignments:
                  key = `ass${String(entry.content_id)}`;
                  break;
                case TileType.Discussions:
                  key = `disc${String(entry.content_id)}`;
                  break;
                case TileType.LearningOutcomes:
                  key = `goal${String(entry.content_id)}`;
                  break;
                default:
                  return;
              }

              acc.push(
                <SelectItem key={key} value={key}>
                  {entry.title}
                </SelectItem>,
              );
            });
            return acc;
          }, [])}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
