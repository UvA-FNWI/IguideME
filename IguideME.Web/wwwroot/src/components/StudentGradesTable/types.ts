import {Tile, TileEntry, TileEntrySubmission, TileGroup} from "../../models/app/Tile";
import {CanvasStudent} from "../../models/canvas/Student";

export interface IProps {
  averaged: boolean;
}

export interface IState {
  loaded: boolean;
  tiles: Tile[];
  tileGroups: TileGroup[];
  tileEntries: TileEntry[];
  submissions: TileEntrySubmission[];
  students: CanvasStudent[];
}