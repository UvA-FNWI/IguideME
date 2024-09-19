import type { Submission } from '@/types/grades';
import apiClient from './axios';
import { type Tile, type LayoutColumn, type TileGroup } from '@/types/tile';

export async function getLayoutColumns(): Promise<LayoutColumn[]> {
  return await apiClient.get(`layout/columns`).then((response) => response.data);
}
export async function postLayoutColumns(layouts: LayoutColumn[]): Promise<void> {
  await apiClient.post(`layout/columns`, layouts);
}

export async function getTileGroups(): Promise<TileGroup[]> {
  return await apiClient.get(`tiles/groups`).then((response) => response.data);
}
export async function postTileGroup(group: TileGroup): Promise<void> {
  await apiClient.post(`tiles/groups/${group.id}`, group);
}

export async function deleteTileGroup(id: number): Promise<void> {
  await apiClient.delete(`tiles/groups/${id}`);
}

export async function patchTileGroup(group: TileGroup): Promise<void> {
  await apiClient.patch(`tiles/groups/${group.id}`, group);
}

export async function patchTileGroupOrder(ids: number[]): Promise<void> {
  await apiClient.patch(`tiles/groups/order`, ids);
}

export async function getGroupTiles(id: number): Promise<Tile[]> {
  return await apiClient.get(`tilegroup/${id}/tiles`).then((response) => response.data);
}
export async function getTiles(): Promise<Tile[]> {
  return await apiClient.get(`tiles`).then((response) => response.data);
}
export async function getTile(tid: number | string): Promise<Tile> {
  return await apiClient.get(`tile/${tid}`).then((response) => response.data);
}
export async function postTile(tile: Tile): Promise<void> {
  await apiClient.post(`tiles/${tile.id}`, tile);
}

export async function patchTile(tile: Tile): Promise<void> {
  await apiClient.patch(`tiles/${tile.id}`, tile);
}

export async function deleteTile(id: number): Promise<void> {
  await apiClient.delete(`tiles/${id}`);
}

export async function patchTileOrder(ids: number[]): Promise<void> {
  await apiClient.patch(`tiles/order`, ids);
}

// These are the new required routes
export async function deleteTileEntry(id: number): Promise<void> {
  await apiClient.delete(`/entries/${id}`);
}

interface UploadDataProps {
  tileID: number;
  idColumn: number;
  gradeColumn: number;
  title: string;
  data: any[];
}

export async function uploadData({
  tileID: tileID,
  idColumn,
  gradeColumn,
  title,
  data,
}: UploadDataProps): Promise<any[]> {
  return await apiClient
    .post(`/entries/${tileID}/upload`, { idColumn, gradeColumn, title, data })
    .then((response) => response.data);
}

export async function getTileSubmissions({ tileId }: { tileId: number }): Promise<Submission[]> {
  return await apiClient.get(`tiles/${tileId}/submissions`).then((response) => response.data);
}

export async function AddDataWizardTile({ tileId, groupId }: { tileId: number; groupId: number }): Promise<void> {
  // Maybe there should be another url for this
  await apiClient.post(`tiles/data-wizard`, { tileId, groupId });
}
