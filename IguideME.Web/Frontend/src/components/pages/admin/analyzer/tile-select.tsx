import type { ReactElement } from 'react';
import { type Tile, TileType } from '@/types/tile';
import { Select } from 'antd';

const { Option, OptGroup } = Select;

export function TileSelect({
  tiles,
  setKey,
  changeKey,
}: {
  tiles: Tile[];
  setKey: string;
  changeKey: (key: string) => void;
}): ReactElement {
  return (
    <Select value={setKey} onChange={changeKey} style={{ minWidth: '224px', flex: 1 }}>
      <OptGroup label='Tiles'>
        {tiles.map((tile) => (
          <Option key={tile.id} value={`tile-${String(tile.id)}`}>
            {tile.title}
          </Option>
        ))}
      </OptGroup>

      <OptGroup label='Entries'>
        {tiles.reduce<ReactElement[]>((acc, tile) => {
          tile.entries.forEach((entry) => {
            if (acc.some((x) => x.key === `key-${String(entry.content_id)}`)) return;

            let key = '';
            switch (tile.type) {
              case TileType.assignments:
                key = `ass-${String(entry.content_id)}`;
                break;
              case TileType.discussions:
                key = `disc-${String(entry.content_id)}`;
                break;
              case TileType.learning_outcomes:
                key = `goal-${String(entry.content_id)}`;
                break;
              default:
                return;
            }

            acc.push(
              <Option key={key} value={key}>
                {entry.title}
              </Option>,
            );
          });
          return acc;
        }, [])}
      </OptGroup>
    </Select>
  );
}
