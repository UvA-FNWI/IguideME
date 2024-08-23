import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { MOCK_STUDENTS } from '@/mocks/user/user-example-data';
import { type Tile, type TileGrades, type TileGroup } from '@/types/tile';

import { MOCK_PEER_TILE_GRADES, MOCK_TILE_GRADES } from './grade-example-data';
import { MOCK_GROUPS, MOCK_TILES } from './tile-example-data';

export const tileHandlers = [
  // ------
  // Tile Group Operations
  // ------

  http.get(basePath('api/tile/group'), () => {
    return HttpResponse.json<TileGroup[]>(MOCK_GROUPS);
  }),

  http.post(basePath('api/tile/group/:groupId'), async ({ request }) => {
    const newGroup = await request.json();
    MOCK_GROUPS.push(newGroup as TileGroup);
    return HttpResponse.json(newGroup, { status: 201 });
  }),

  http.delete(basePath('api/tile/group/:groupId'), ({ params }) => {
    const groupID = parseInt(params.groupId as string, 10);
    const index = MOCK_GROUPS.findIndex((group) => group.id === groupID);
    if (index !== -1) MOCK_GROUPS.splice(index, 1);

    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(basePath('api/tile/group/:groupId'), async ({ params, request }) => {
    const groupID = parseInt(params.groupId as string, 10);
    const patchedGroup = await request.json();
    const index = MOCK_GROUPS.findIndex((group) => group.id === groupID);
    if (index !== -1) MOCK_GROUPS[index] = { ...MOCK_GROUPS[index], ...(patchedGroup as TileGroup) };

    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(basePath('api/tile/group/order'), async ({ request }) => {
    const ids = await request.json();
    const newGroups = (ids as number[]).map((id: number) => MOCK_GROUPS.find((group) => group.id === id));
    if (newGroups.some((group) => group === undefined)) return new HttpResponse(null, { status: 400 });

    MOCK_GROUPS.splice(0, MOCK_GROUPS.length, ...(newGroups as TileGroup[]));

    return new HttpResponse(null, { status: 200 });
  }),

  // ------
  // Tile Operations
  // ------

  http.get(basePath('api/tile'), () => {
    return HttpResponse.json<Tile[]>(MOCK_TILES);
  }),

  http.get(basePath('api/tile/:tileId'), ({ params }) => {
    const tileID = parseInt(params.tileId as string, 10);
    const tile = MOCK_TILES.find((t) => t.id === tileID);
    if (tile) return HttpResponse.json(tile);

    return new HttpResponse(null, { status: 404 });
  }),

  http.post(basePath('api/tile/:tileId'), async ({ request }) => {
    const newTile = await request.json();
    MOCK_TILES.push(newTile as Tile);
    return HttpResponse.json(newTile, { status: 201 });
  }),

  http.patch(basePath('api/tile/:tileId'), async ({ params, request }) => {
    const tileID = parseInt(params.tileId as string, 10);
    const patchedTile = await request.json();
    const index = MOCK_TILES.findIndex((tile) => tile.id === tileID);
    if (index !== -1) MOCK_TILES[index] = { ...MOCK_TILES[index], ...(patchedTile as Tile) };

    return new HttpResponse(null, { status: 200 });
  }),

  http.delete(basePath('api/tile/:tileId'), ({ params }) => {
    const tileID = parseInt(params.tileId as string, 10);
    const index = MOCK_TILES.findIndex((tile) => tile.id === tileID);
    if (index !== -1) MOCK_TILES.splice(index, 1);

    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(basePath('api/tile/order'), async ({ request }) => {
    const ids = await request.json();
    const newTiles = (ids as number[]).map((id: number) => MOCK_TILES.find((tile) => tile.id === id));
    if (newTiles.some((tile) => tile === undefined)) return new HttpResponse(null, { status: 400 });

    MOCK_TILES.splice(0, MOCK_TILES.length, ...(newTiles as Tile[]));

    return new HttpResponse(null, { status: 200 });
  }),

  // ------
  // Tile Group Specific Tile Operations
  // ------

  http.get(basePath('api/tile-group/:groupId/tile'), ({ params }) => {
    const groupID = parseInt(params.groupId as string, 10);
    const tiles = MOCK_TILES.filter((tile) => tile.group_id === groupID);
    return HttpResponse.json(tiles);
  }),

  // ------
  // Tile Grade Operations
  // ------

  http.get(basePath('api/tile/grade'), () => {
    return HttpResponse.json(MOCK_TILE_GRADES);
  }),

  http.get(basePath('api/tile/:tileId/grade/:userId'), ({ params }) => {
    const tileId = params.tileId;
    const userId = params.userId;

    const tileGrades = MOCK_TILE_GRADES.find((a) => a.userID === userId);
    if (!tileGrades) {
      return new HttpResponse(null, { status: 404, statusText: `No grades found for user ${String(userId)}` });
    }

    const result = tileGrades.tile_grades.find((tg) => tg.tile_id.toString() === tileId);
    if (!result) {
      return new HttpResponse(null, { status: 404, statusText: `No grades found for tile ${String(tileId)}` });
    }

    const student = MOCK_STUDENTS.find((a) => a.userID === userId);
    if (!student?.settings) {
      return new HttpResponse(null, {
        status: 404,
        statusText: `Student settings not found for user ${String(userId)}`,
      });
    }

    const peerTileGrades = MOCK_PEER_TILE_GRADES[student.settings.goal_grade];
    if (!peerTileGrades) {
      return new HttpResponse(null, { status: 404, statusText: 'Peer tile grades not found for goal grade' });
    }

    const peerGrade = peerTileGrades.find((pg) => pg.tileID.toString() === tileId);
    if (!peerGrade) {
      return new HttpResponse(null, { status: 404, statusText: `Peer grade not found for tile ${String(tileId)}` });
    }

    return HttpResponse.json<TileGrades>({
      ...result,
      ...peerGrade,
    });
  }),
];
