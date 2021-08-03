import { Tile, TileEntry } from "../../../../../../models/app/Tile";

export interface IProps {
  setEntryOne: (entryId: string | undefined) => any;
  setEntryTwo: (entryId: string | undefined) => any;
  tiles: Tile[];
  entries: TileEntry[]
}
