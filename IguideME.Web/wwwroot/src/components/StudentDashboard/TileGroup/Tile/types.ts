import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";
import {PeerGrades, TilesGradeSummary} from "../../types";
import {CanvasDiscussion} from "../../../../models/canvas/Discussion";
import {LearningOutcome} from "../../../../models/app/LearningGoal";

export interface IProps {
  tile: Tile;
  tileEntries: TileEntry[];
  student: CanvasStudent;
  userGrades: TilesGradeSummary[];
  peerGrades: PeerGrades[];
  submissions: TileEntrySubmission[];
  discussions: CanvasDiscussion[];
  learningOutcomes: LearningOutcome[];
}

export interface IState {
  loaded: boolean;
}