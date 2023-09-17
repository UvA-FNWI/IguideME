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
