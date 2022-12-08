import {Tile, TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";

export interface IProps {

}

export interface IState {
  tiles: Tile[];
  entryOne: TileEntry | null;
  entryTwo: TileEntry | null;
  allEntries: TileEntry[];
  allSubmissions: TileEntrySubmission[];
  submissionsOne: TileEntrySubmission[];
  submissionsTwo: TileEntrySubmission[];
}