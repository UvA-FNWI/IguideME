import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import TileGroupBoard from '@/components/crystals/tile-group-board/tile-group-board';
import { type FC, type ReactElement } from 'react';

const Tiles: FC = (): ReactElement => {
  return (
    <div className='tilePage'>
      <AdminTitle title='Tiles' description='Configure the tiles and tile groups.' />
      <TileGroupBoard />
    </div>
  );
};

export default Tiles;
