import { Tile, TileEntry } from "../../../../../../models/app/Tile";

export interface IProps {
  setEntryOne: (entryId: number | undefined) => any;
  setEntryTwo: (entryId: number | undefined) => any;
  tiles: Tile[];
  entries: TileEntry[]
}
