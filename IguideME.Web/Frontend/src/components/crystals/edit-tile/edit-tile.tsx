import { type Tile } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

interface Props {
	tile: Tile;
}

const EditTile: FC<Props> = ({ tile }): ReactElement => {
	return <div>{tile.position}</div>;
};

export default EditTile;
