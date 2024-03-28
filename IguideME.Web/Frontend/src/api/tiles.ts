import apiClient from './axios';
import { type Tile, type LayoutColumn, type TileGroup, type TileGrades } from '@/types/tile';

export const getLayoutColumns: () => Promise<LayoutColumn[]> = async () =>
  await apiClient.get(`layout/columns`).then((response) => response.data);

export const postLayoutColumns: (layouts: LayoutColumn[]) => Promise<void> = async (layouts: LayoutColumn[]) => {
  await apiClient.post(`layout/columns`, layouts);
};

export const getTileGroups: () => Promise<TileGroup[]> = async () =>
  await apiClient.get(`tiles/groups`).then((response) => response.data);

export const postTileGroup: (group: TileGroup) => Promise<void> = async (group: TileGroup) => {
  await apiClient.post(`tiles/groups/${group.id}`, group);
};

export const deleteTileGroup: (id: number) => Promise<void> = async (id: number) => {
  await apiClient.delete(`tiles/groups/${id}`);
};

export const patchTileGroup: (group: TileGroup) => Promise<void> = async (group: TileGroup) => {
  await apiClient.patch(`tiles/groups/${group.id}`, group);
};

export const patchTileGroupOrder: (ids: number[]) => Promise<void> = async (ids: number[]) => {
  await apiClient.patch(`tiles/groups/order`, ids);
};

export const getGroupTiles: (id: number) => Promise<Tile[]> = async (id: number) =>
  await apiClient.get(`tilegroup/${id}/tiles`).then((response) => response.data);

export const getTiles: () => Promise<Tile[]> = async () =>
  await apiClient.get(`tiles`).then((response) => response.data);

export const getTile: (tid: number | string) => Promise<Tile> = async (tid: number | string) =>
  await apiClient.get(`tile/${tid}`).then((response) => response.data);

export const getTileGrades: (userID: string, tileID: number) => Promise<TileGrades> = async (
  userID: string,
  tileID: number,
) => await apiClient.get(`tiles/${tileID}/grades/${userID}`).then((response) => response.data);

export const postTile: (tile: Tile) => Promise<void> = async (tile: Tile) => {
  await apiClient.post(`tiles/${tile.id}`, tile);
};

export const patchTile: (tile: Tile) => Promise<void> = async (tile: Tile) => {
  await apiClient.patch(`tiles/${tile.id}`, tile);
};

export const deleteTile: (id: number) => Promise<void> = async (id: number) => {
  await apiClient.delete(`tiles/${id}`);
};

export const patchTileOrder: (ids: number[]) => Promise<void> = async (ids: number[]) => {
  await apiClient.patch(`tiles/order`, ids);
};
