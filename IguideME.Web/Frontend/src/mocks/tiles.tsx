import {
  type TileGroup,
  type LayoutColumn,
  type Tile,
  TileType,
  GradingType,
} from "@/types/tile";
import { http, HttpResponse } from "msw";

export const tileHandlers = [
  http.get("/layout/columns", () => {
    return HttpResponse.json<LayoutColumn[]>(MOCK_COLUMNS);
  }),
  http.post("/layout/columns", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("/tiles/groups", () => {
    return HttpResponse.json<TileGroup[]>(MOCK_GROUPS);
  }),
  http.post("/tiles/groups/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete("/tiles/groups/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch("/tiles/groups/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch("/tiles/groups/order", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("tilegroup/*/tiles", ({ params }) => {
    return HttpResponse.json<Tile[]>(
      MOCK_TILES.filter((tile) => tile.group_id.toString() === params[0]),
    );
  }),
  http.get("/tiles", () => {
    return HttpResponse.json<Tile[]>(MOCK_TILES);
  }),
  http.post("/tiles/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch("/tiles/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete("/tiles/*", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch("/tiles/order", () => {
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
    title: "Activities",
    position: 1,
  },
  {
    id: 2,
    title: "Course Grades",
    position: 1,
  },
  {
    id: 3,
    title: "Learning Outcome",
    position: 2,
  },
];

const MOCK_TILES: Tile[] = [
  {
    id: 1,
    group_id: 1,
    title: "Quizzes",
    position: 1,
    weight: 1,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.Percentage,
    entries: [],
  },
  {
    id: 2,
    group_id: 1,
    title: "Perusall",
    position: 2,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.PassFail,
    entries: [],
  },
  {
    id: 3,
    group_id: 1,
    title: "Attendance",
    position: 4,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.PassFail,
    entries: [],
  },
  {
    id: 4,
    group_id: 1,
    title: "Practice Sessions",
    position: 3,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    entries: [],
  },
  {
    id: 5,
    group_id: 2,
    title: "Exam Grades",
    position: 1,
    weight: 9,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.Points,
    entries: [],
  },
  {
    id: 6,
    group_id: 1,
    title: "Preparation Time",
    position: 5,
    weight: 0,
    type: TileType.assignments,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    entries: [],
  },
  {
    id: 7,
    group_id: 1,
    title: "Send in Questions",
    position: 6,
    weight: 0,
    type: TileType.discussions,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    entries: [],
  },
  {
    id: 9,
    group_id: 3,
    title: "Learning Outcomes",
    position: 2,
    weight: 0,
    type: TileType.learning_outcomes,
    visible: true,
    notifications: true,
    gradingType: GradingType.NotGraded,
    entries: [],
  },
];
