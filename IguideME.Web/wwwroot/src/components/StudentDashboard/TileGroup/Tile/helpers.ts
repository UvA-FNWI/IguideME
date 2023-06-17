import {Tile, TileEntry, AssignmentSubmission} from "../../../../models/app/Tile";

export const getProgression = (tile: Tile, entries: TileEntry[], submissions: AssignmentSubmission[]): number => {
  if (tile.content === "BINARY") {
    return submissions.length > 0 ?
      Math.round((
        submissions.filter(s => parseFloat(s.grade) > .8).length /
        entries.length
      ) * 100) : 0;
  }

  return Math.round((submissions.length / entries.length) * 100);
}