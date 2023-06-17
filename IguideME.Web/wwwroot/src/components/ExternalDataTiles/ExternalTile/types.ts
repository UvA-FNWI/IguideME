import {Tile, AssignmentSubmission, TileGroup} from "../../../models/app/Tile";
import {CanvasStudent} from "../../../models/canvas/Student";

export interface IProps {
  tile: Tile;
  tileGroup: TileGroup;
}

export interface IState {
  loaded: boolean;
  uploadMenuOpen: boolean;
  students: CanvasStudent[];
  submissions: AssignmentSubmission[];
}
