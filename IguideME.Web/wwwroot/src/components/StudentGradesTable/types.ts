import {Tile, TileEntry, AssignmentSubmission, TileGroup} from "../../models/app/Tile";
import { CanvasDiscussion } from "../../models/canvas/Discussion";
import {CanvasStudent} from "../../models/canvas/Student";

export interface IProps {
}

export interface IState {
  averaged: boolean;
  loaded: boolean;
  tiles: Tile[];
  tileGroups: TileGroup[];
  tileEntries: TileEntry[];
  discussions: CanvasDiscussion[];
  submissions: AssignmentSubmission[];
  students: CanvasStudent[];
}
