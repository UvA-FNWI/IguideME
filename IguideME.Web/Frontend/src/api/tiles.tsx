import apiClient from './axios';
import { type LayoutColumn, type TileGroup } from '@/types/tile';

export const getLayoutColumns: () => Promise<LayoutColumn[]> = async () =>
	await apiClient.get(`layout/columns`).then((response) => response.data);

export const postLayoutColumns: (layouts: LayoutColumn[]) => Promise<void> = async (layouts: LayoutColumn[]) => {
	await apiClient.post(`layout/columns`, layouts);
};

export const getTileGroups: () => Promise<TileGroup[]> = async () =>
	await apiClient.get(`tiles/groups`).then((response) => response.data);

export const postTileGroup: (group: TileGroup) => Promise<void> = async (group: TileGroup) => {
	console.log('group', group);
	await apiClient.post(`tiles/group`, group);
};

export const patchTileGroup: (title?: string, position?: number) => Promise<void> = async (
	title?: string,
	position?: number,
) => {
	await apiClient.patch(`tiles/group`, { title, position });
};
