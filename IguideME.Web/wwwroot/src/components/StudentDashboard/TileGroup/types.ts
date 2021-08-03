import {Tile, TileEntry, TileEntrySubmission, TileGroup} from "../../../models/app/Tile";
import {CanvasStudent} from "../../../models/canvas/Student";
import {PeerGrades, TilesGradeSummary} from "../types";

export interface IProps {
  tileGroup: TileGroup;
  tiles: Tile[];
  tileEntries: TileEntry[];
  student: CanvasStudent;
  tilesGradeSummary: TilesGradeSummary[];
  peerGrades: PeerGrades[];
  submissions: TileEntrySubmission[];
}