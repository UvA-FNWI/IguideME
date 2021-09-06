import {Tile, TileEntry, TileEntrySubmission, TileGroup} from "../../../models/app/Tile";
import {CanvasStudent} from "../../../models/canvas/Student";
import {PeerGrades, TilesGradeSummary} from "../types";
import {CanvasDiscussion} from "../../../models/canvas/Discussion";
import {LearningOutcome} from "../../../models/app/LearningGoal";

export interface IProps {
  learningOutcomes: LearningOutcome[];
  tileGroup: TileGroup;
  tiles: Tile[];
  discussions: CanvasDiscussion[];
  tileEntries: TileEntry[];
  student: CanvasStudent;
  tilesGradeSummary: TilesGradeSummary[];
  peerGrades: PeerGrades[];
  submissions: TileEntrySubmission[];
}