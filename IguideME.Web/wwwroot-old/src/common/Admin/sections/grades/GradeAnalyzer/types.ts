import {Tile, TileEntry, AssignmentSubmission} from "../../../../../models/app/Tile";

export interface IProps {

}

export interface IState {
  tiles: Tile[];
  entryOne: TileEntry | null;
  entryTwo: TileEntry | null;
  allEntries: TileEntry[];
  allSubmissions: AssignmentSubmission[];
  submissionsOne: AssignmentSubmission[];
  submissionsTwo: AssignmentSubmission[];
}