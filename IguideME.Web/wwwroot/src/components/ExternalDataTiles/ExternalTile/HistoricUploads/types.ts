import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";

export interface IProps {
  tile: Tile;
  entries: TileEntry[],
  submissions: TileEntrySubmission[],
  students: CanvasStudent[],
  reload: () => any
}

export interface IState {
  drawerOpen: boolean;
  openEntry: TileEntry | undefined;
}