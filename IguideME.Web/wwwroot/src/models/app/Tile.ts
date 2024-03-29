export enum editState {
  unchanged,
  new,
  updated,
  removed
}

export interface TileGroup {
  id: number;
  course_id: number;
  title: string;
  position: number;
  column_id: number;
}

export type TileContentTypes = "BINARY" | "ENTRIES" | "PREDICTION" | "LEARNING_OUTCOMES";
export type TileTypeTypes = "ASSIGNMENTS" | "DISCUSSIONS" | "EXTERNAL_DATA" | undefined;

export interface Tile {
  id: number;
  group_id: number;
  title: string;
  position: number;
  visible: boolean;
  content: TileContentTypes;
  type: TileTypeTypes;
  notifications?: boolean;
  graph_view: boolean;
  wildcard: boolean;
}

export interface TileEntry {
  id: number;
  state: editState
  tile_id: number;
  title: string;
  type: "ASSIGNMENT" | "DISCUSSION" | "LEARNING_OUTCOMES"
}

export interface TileEntrySubmission {
  userID: string,
  entry_id: number,
  grade: string,
  submitted?: string | null,
  meta?: string | null | any
}
