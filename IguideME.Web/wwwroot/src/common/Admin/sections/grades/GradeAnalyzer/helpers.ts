import {Tile, TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";

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

export const mergeData = (stack1: TileEntrySubmission[], stack2: TileEntrySubmission[]) => {
  const users = new Set([...stack1.map(s => s.user_login_id), ...stack2.map(s => s.user_login_id)]);

  return Array.from(users).filter(u => (
    stack1.find(s => s.user_login_id === u) &&
      stack2.find(s => s.user_login_id === u)
    )
  ).map(u => ({
    user_login_id: u,
    grade1: stack1.find(s => s.user_login_id === u)!.grade,
    grade2: stack2.find(s => s.user_login_id === u)!.grade
  }));
}