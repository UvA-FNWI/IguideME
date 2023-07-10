import { CanvasStudent } from "../../../models/canvas/Student";
import {Tile, TileEntry} from "../../../models/app/Tile";
import {PredictedGrade} from "../../../models/app/PredictiveModel";
import {PeerGrades, TilesGradeSummary} from "../types";

export interface IProps {
  tiles: Tile[];
  tileEntries: TileEntry[];
  student: CanvasStudent;
  tilesGradeSummary: TilesGradeSummary[];
  peerGrades: PeerGrades[];
}
