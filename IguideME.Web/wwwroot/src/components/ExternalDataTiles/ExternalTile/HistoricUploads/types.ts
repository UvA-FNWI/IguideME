import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";

export interface IProps {
  tile: Tile;
}

export interface IState {
  loaded: boolean;
  tiles: Tile[];
  entries: TileEntry[];
  submissions: TileEntrySubmission[];
  drawerOpen: boolean;
  openEntry: TileEntry | undefined;
  students: CanvasStudent[];
}