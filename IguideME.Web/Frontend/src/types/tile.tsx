export interface LayoutColumn {
	width: number;
	id: number;
	position: number;
	groups: string[];
}

export interface TileGroup {
	id: number;
	title: string;
	position: number;
}

export interface Tile {
	id: number;
	title: string;
	// TODO:
}
