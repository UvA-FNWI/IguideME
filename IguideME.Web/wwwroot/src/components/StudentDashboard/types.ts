import { CanvasStudent } from "../../models/canvas/Student";
import {Tile, TileEntrySubmission} from "../../models/app/Tile";
import {CanvasDiscussion} from "../../models/canvas/Discussion";
import {LearningOutcome} from "../../models/app/LearningGoal";

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
  learningOutcomes: LearningOutcome[];
  discussions: CanvasDiscussion[];
  userSubmissions: TileEntrySubmission[];
}

export interface TilesGradeSummary {
  tile: Tile, average: number
}

export interface PeerGrades {
  min: number, max: number, avg: number, tileID: number
}

