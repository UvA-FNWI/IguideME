import {Tile, TileEntry, AssignmentSubmission} from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";

export interface IProps {
  tile: Tile;
  entries: TileEntry[],
  submissions: AssignmentSubmission[],
  students: CanvasStudent[],
  reload: () => any
}

export interface IState {
  drawerOpen: boolean;
  openEntry: TileEntry | undefined;
}