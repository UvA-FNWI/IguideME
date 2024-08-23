import { type Tile, type TileGrades, type TileGroup } from '@/types/tile';

import { apiClient } from './axios';

// ------
// Tile Group Operations
// ------

async function getTileGroups(): Promise<TileGroup[]> {
  const response = await apiClient.get('api/tile/group');
  return response.data as TileGroup[];
}

async function postTileGroup(group: TileGroup): Promise<void> {
  await apiClient.post(`api/tile/group/${String(group.id)}`, group);
}

async function deleteTileGroup(id: number): Promise<void> {
  await apiClient.delete(`api/tile/group/${String(id)}`);
}

async function patchTileGroup(group: TileGroup): Promise<void> {
  await apiClient.patch(`api/tile/group/${String(group.id)}`, group);
}

async function patchTileGroupOrder(ids: number[]): Promise<void> {
  await apiClient.patch(`api/tile/group/order`, ids);
}

// ------
// Tile Operations
// ------

async function getTiles(): Promise<Tile[]> {
  const response = await apiClient.get(`api/tile`);
  return response.data as Tile[];
}

async function getTile(tid: number | string | undefined): Promise<Tile | null> {
  if (!tid) return null;
  const response = await apiClient.get(`api/tile/${String(tid)}`);
  return response.data as Tile;
}

async function postTile(tile: Tile): Promise<void> {
  await apiClient.post(`api/tile/${String(tile.id)}`, tile);
}

async function patchTile(tile: Tile): Promise<void> {
  await apiClient.patch(`api/tile/${String(tile.id)}`, tile);
}

async function deleteTile(id: number): Promise<void> {
  await apiClient.delete(`api/tile/${String(id)}`);
}

async function patchTileOrder(ids: number[]): Promise<void> {
  await apiClient.patch(`api/tile/order`, ids);
}

async function patchTileLayout({
  tileGroupIds,
  tileIds,
}: {
  tileGroupIds: number[];
  tileIds: number[];
}): Promise<void> {
  await apiClient.patch(`tiles/groups/order`, tileGroupIds);
  await apiClient.patch(`tiles/order`, tileIds);
}

// ------
// Tile Group Specific Tile Operations
// ------

async function getGroupTiles(id: number): Promise<Tile[]> {
  const response = await apiClient.get(`api/tile-group/${String(id)}/tile`);
  return response.data as Tile[];
}

// ------
// Tile Grade Operations
// ------

async function getTileGrades(userID: string, tileID: number): Promise<TileGrades> {
  const response = await apiClient.get(`api/tile/${String(tileID)}/grade/${userID}`);
  return response.data as TileGrades;
}

async function getAllTileGrades(): Promise<{ userID: string; goal: number; tile_grades: TileGrades[] }[]> {
  const response = await apiClient.get(`api/tile/grade/`);
  return response.data as { userID: string; goal: number; tile_grades: TileGrades[] }[];
}

export {
  deleteTile,
  deleteTileGroup,
  getAllTileGrades,
  getGroupTiles,
  getTile,
  getTileGrades,
  getTileGroups,
  getTiles,
  patchTile,
  patchTileGroup,
  patchTileGroupOrder,
  patchTileLayout,
  patchTileOrder,
  postTile,
  postTileGroup,
};
