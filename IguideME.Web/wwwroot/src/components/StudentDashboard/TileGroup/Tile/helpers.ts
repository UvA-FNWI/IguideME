import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {TilesGradeSummary} from "../../types";

export const getProgression = (tile: Tile, entries: TileEntry[], submissions: TileEntrySubmission[]): number => {
  if (tile.content === "BINARY") {
    return submissions.length > 0 ?
      Math.round((
        submissions.filter(s => parseFloat(s.grade) > .8).length /
        entries.length
      ) * 100) : 0;
  }

  return Math.round((submissions.length / entries.length) * 100);
}