import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";
import {PeerGrades, TilesGradeSummary} from "../../types";

export interface IProps {
  tile: Tile;
  tileEntries: TileEntry[];
  student: CanvasStudent;
  userGrades: TilesGradeSummary[];
  peerGrades: PeerGrades[];
  submissions: TileEntrySubmission[];
}

export interface IState {
  loaded: boolean;
}