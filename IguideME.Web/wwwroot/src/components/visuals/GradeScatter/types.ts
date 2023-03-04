import { TileEntry } from "../../../models/app/Tile"

export interface IProps {
  entryOne: TileEntry
  entryTwo: TileEntry
  mergedData: MergedData[]
}

export type MergedData = {
  grade1: string,
  grade2: string,
  userID: string
}
