import {Tile, TileEntry, TileEntrySubmission, TileGroup} from "../../models/app/Tile";
import { CanvasDiscussion } from "../../models/canvas/Discussion";
import {CanvasStudent} from "../../models/canvas/Student";

export interface IProps {
  averaged: boolean;
}

export interface IState {
  loaded: boolean;
  tiles: Tile[];
  tileGroups: TileGroup[];
  tileEntries: TileEntry[];
  discussions: CanvasDiscussion[];
  submissions: TileEntrySubmission[];
  students: CanvasStudent[];
}