import { GradingType, type LayoutColumn, type Tile, type TileGroup, TileType } from '@/types/tile';
import { http, HttpResponse } from 'msw';
import { MOCK_ASSIGNMENTS, MOCK_GOALS, MOCK_TOPICS } from './entries';

export const tileHandlers = [
  http.get('/layout/columns', () => {
    return HttpResponse.json<LayoutColumn[]>(MOCK_COLUMNS);
  }),
  http.post('/layout/columns', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get('/tiles/groups', () => {
    return HttpResponse.json<TileGroup[]>(MOCK_GROUPS);
  }),
  http.post('/tiles/groups/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete('/tiles/groups/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/tiles/groups/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/tiles/groups/order', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get('/tilegroup/:groupID/tiles', ({ params }) => {
    const groupID = parseInt(params.groupID as string, 10);
    return HttpResponse.json<Tile[]>(MOCK_TILES.filter((tile) => tile.visible && tile.group_id === groupID));
  }),
  http.get('/tiles', () => {
    return HttpResponse.json<Tile[]>(MOCK_TILES);
  }),
  http.get('/tile/*', ({ params }) => {
    return HttpResponse.json<Tile | undefined>(MOCK_TILES.find((tile) => tile.id.toString() === params[0]));
  }),
  http.post('/tiles/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/tiles/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete('/tiles/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/tiles/order', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

const MOCK_COLUMNS: LayoutColumn[] = [
  {
    id: 1,
    width: 30,
    position: 0,
    groups: [2, 3],
  },
  {
    id: 2,
    width: 70,
    position: 1,
    groups: [1],
  },
];

const MOCK_GROUPS: TileGroup[] = [
  {
    id: 1,
    title: 'Activities',
    position: 1,
  },
  {
    id: 2,
    title: 'Course Grades',
    position: 1,
  },
  {
    id: 3,
    title: 'Learning Outcome',
    position: 2,
  },
];

export const MOCK_TILES: Tile[] = [
  {
    id: 1,
    group_id: 1,
    title: 'Quizzes',
    position: 1,
    weight: 0.1,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.Percentage,
    alt: false,
    alt: false,
    entries: [
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 1)!.title,
        weight: 0.25,
        content_id: 1,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 2)!.title,
        weight: 0.25,
        content_id: 2,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 3)!.title,
        weight: 0.25,
        content_id: 3,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 4)!.title,
        weight: 0.25,
        content_id: 4,
      },
    ],
  },
  {
    id: 2,
    group_id: 1,
    title: 'Perusall',
    position: 2,
    weight: 0.1,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.PassFail,
    alt: false,
    entries: [
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 9)!.title,
        weight: 0.33,
        content_id: 9,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 10)!.title,
        weight: 0.33,
        content_id: 10,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 11)!.title,
        weight: 0.33,
        content_id: 11,
      },
    ],
  },
  {
    id: 3,
    group_id: 1,
    title: 'Attendance',
    position: 4,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.PassFail,
    alt: false,
    entries: [],
    alt: false,
  },
  {
    id: 4,
    group_id: 1,
    title: 'Practice Sessions',
    position: 3,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    alt: false,
    entries: [
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 12)!.title,
        weight: 0.125,
        content_id: 12,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 13)!.title,
        weight: 0.125,
        content_id: 13,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 14)!.title,
        weight: 0.125,
        content_id: 14,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 15)!.title,
        weight: 0.125,
        content_id: 15,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 16)!.title,
        weight: 0.125,
        content_id: 16,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 17)!.title,
        weight: 0.125,
        content_id: 17,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 18)!.title,
        weight: 0.125,
        content_id: 18,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((ass) => ass.id === 19)!.title,
        weight: 0.125,
        content_id: 19,
      },
    ],
  },
  {
    id: 5,
    group_id: 2,
    title: 'Exam Grades',
    position: 1,
    weight: 0.8,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.Points,
    alt: false,
    entries: [
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((top) => top.id === 5)!.title,
        weight: 0.25,
        content_id: 5,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((top) => top.id === 6)!.title,
        weight: 0.25,
        content_id: 6,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((top) => top.id === 7)!.title,
        weight: 0.25,
        content_id: 7,
      },
      {
        tile_id: 1,
        title: MOCK_ASSIGNMENTS.find((top) => top.id === 8)!.title,
        weight: 0.25,
        content_id: 8,
      },
    ],
  },
  {
    id: 6,
    group_id: 1,
    title: 'Preparation Time',
    position: 5,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    alt: false,
    entries: [],
    alt: false,
  },
  {
    id: 7,
    group_id: 1,
    title: 'Send in Questions',
    position: 6,
    weight: 0,
    type: TileType.discussions,
    visible: true,
    notifications: false,
    gradingType: GradingType.NotGraded,
    alt: true,
    entries: [
      {
        tile_id: 7,
        title: MOCK_TOPICS.find((top) => top.id === 1)!.title,
        weight: 0.333,
        content_id: 1,
      },
      {
        tile_id: 7,
        title: MOCK_TOPICS.find((top) => top.id === 2)!.title,
        weight: 0.333,
        content_id: 2,
      },
      {
        tile_id: 7,
        title: MOCK_TOPICS.find((top) => top.id === 3)!.title,
        weight: 0.333,
        content_id: 3,
      },
    ],
  },
  {
    id: 9,
    group_id: 3,
    title: 'Learning Outcomes',
    position: 2,
    weight: 0,
    type: TileType.learning_outcomes,
    visible: true,
    notifications: true,
    gradingType: GradingType.Points,
    alt: false,
    entries: [
      {
        tile_id: 7,
        title: MOCK_GOALS.find((goal) => goal.id === 1)!.title,
        weight: 1,
        content_id: 1,
      },
    ],
  },
  {
    id: 10,
    group_id: 2,
    title: 'Hidden',
    position: 2,
    weight: 0,
    type: TileType.assignments,
    visible: false,
    notifications: true,
    gradingType: GradingType.Points,
    alt: false,
    entries: [],
  },
];
