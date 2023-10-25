import apiClient from './axios';
import { type Tile, type LayoutColumn, type TileGroup } from '@/types/tile';

export const getLayoutColumns: () => Promise<LayoutColumn[]> = async () =>
	await apiClient
		.get(`layout/columns`)
		.then((response) => response.data.sort((A: LayoutColumn, B: LayoutColumn) => A.position - B.position));

export const postLayoutColumns: (layouts: LayoutColumn[]) => Promise<void> = async (layouts: LayoutColumn[]) => {
	await apiClient.post(`layout/columns`, layouts);
};

export const getTileGroups: () => Promise<TileGroup[]> = async () =>
	await apiClient.get(`tiles/groups`).then((response) => response.data);

export const postTileGroup: (group: TileGroup) => Promise<void> = async (group: TileGroup) => {
	await apiClient.post(`tiles/group`, group);
};

export const deleteTileGroup: (id: number) => Promise<void> = async (id: number) => {
	await apiClient.delete(`tiles/groups/${id}`);
};

export const patchTileGroup: (group: TileGroup) => Promise<void> = async (group: TileGroup) => {
	await apiClient.patch(`tiles/groups/${group.id}`, group);
};

export const getTiles: () => Promise<Tile[]> = async () =>
	await apiClient.get(`tiles`).then((response) => response.data);

export const postTile: (tile: Tile) => Promise<void> = async (tile: Tile) => {
	await apiClient.post(`tiles`, tile);
};

interface quickTilePatch {
	id: number;
	notifications?: boolean;
	visible?: boolean;
}

export const qPatchTile: (patch: quickTilePatch) => Promise<void> = async (patch: quickTilePatch) => {
	await apiClient.patch(`tiles/${patch.id}`, patch);
};

export const deleteTile: (id: number) => Promise<void> = async (id: number) => {
	await apiClient.delete(`tiles/${id}`);
};
