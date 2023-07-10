import {Tile, TileEntry, AssignmentSubmission} from "../../../../../models/app/Tile";

export const getGradeEntryOptions = (tiles: Tile[], entries: TileEntry[]) => {

  return tiles.map(tile => {
    const tileEntries = entries.filter(e => e.tile_id === tile.id);

    return {
      label: tile.title,
      options: tileEntries.map(e => ({
        label: e.title, value: e.id
      }))
    }
  });
}

export const mergeData = (stack1: AssignmentSubmission[], stack2: AssignmentSubmission[]) => {
  const users = new Set([...stack1.map(s => s.userID), ...stack2.map(s => s.userID)]);

  return Array.from(users).filter(u => (
    stack1.find(s => s.userID === u) &&
      stack2.find(s => s.userID === u)
    )
  ).map(u => ({
    userID: u,
    grade1: stack1.find(s => s.userID === u)!.grade,
    grade2: stack2.find(s => s.userID === u)!.grade
  }));
}
