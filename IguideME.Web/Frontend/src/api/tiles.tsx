import apiClient from './axios';
import { type Tile, type LayoutColumn, type TileGroup } from '@/types/tile';

export const getLayoutColumns: () => Promise<LayoutColumn[]> = async () =>
	await apiClient.get(`layout/columns`).then((response) => response.data);

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

interface GroupPatch {
	id: number;
	title?: string;
	position?: number;
}

export const patchTileGroup: (group: GroupPatch) => Promise<void> = async (group: GroupPatch) => {
	await apiClient.patch(`tiles/group`, group);
};

export const getTiles: () => Promise<Tile[]> = async () =>
	await apiClient.get(`tiles/tiles`).then((response) => response.data);
