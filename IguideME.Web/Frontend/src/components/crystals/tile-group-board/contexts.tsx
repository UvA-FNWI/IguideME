import { type Tile } from '@/types/tile';
import { type Dispatch, type SetStateAction, createContext } from 'react';

interface DrawerInterface {
	editTile: Tile | null;
	setEditTile: Dispatch<SetStateAction<Tile | null>>;
}
export const DrawerContext = createContext<DrawerInterface>({ editTile: null, setEditTile: () => {} });
