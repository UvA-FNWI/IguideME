import { CanvasStudent } from "../../models/canvas/Student";
import {Tile, TileEntrySubmission} from "../../models/app/Tile";

export interface IProps {
  student: CanvasStudent | undefined;
}

export type ViewTypes = "radar" | "grid";

export interface IState {
  tilesGradeSummary: TilesGradeSummary[];
  peerGrades: PeerGrades[];
  loaded: boolean;
  displayTile: Tile | undefined;
  viewType: ViewTypes;
  userSubmissions: TileEntrySubmission[];
}

export interface TilesGradeSummary {
  tile: Tile, average: number
}

export interface PeerGrades {
  min: number, max: number, avg: number, tileID: number
}

