export interface LayoutColumn {
	id: number;
	width: number;
	position: number;
	groups: number[];
}

export interface TileGroup {
	id: number;
	title: string;
	position: number;
}

export enum TileType {
	assignments,
	discussions,
	learning_outcomes,
}

export interface Tile {
	id: number;
	group_id: number;
	title: string;
	position: number;
	type: TileType;
	visible: boolean;
	notifications: boolean;
}
