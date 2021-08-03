import {Tile, TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";

export interface IProps {

}

export interface IState {
  tiles: Tile[];
  entryOne: string | number | undefined;
  entryTwo: string | number | undefined;
  allEntries: TileEntry[];
  allSubmissions: TileEntrySubmission[];
  submissionsOne: TileEntrySubmission[];
  submissionsTwo: TileEntrySubmission[];
}