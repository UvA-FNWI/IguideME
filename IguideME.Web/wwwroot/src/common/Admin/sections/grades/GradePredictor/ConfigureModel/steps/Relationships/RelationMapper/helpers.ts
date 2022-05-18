import { Tile, TileEntry } from "../../../../../../../../../models/app/Tile";

export const getOptionsForTile = (tile: Tile, entries: TileEntry[]) => {
  if (tile.content === "BINARY") {
    return {
      label: tile.title,
      value: tile.id
    }
  }

  return {
    label: tile.title,
    value: tile.id,
    children: entries
      .filter(e => e.tile_id === tile.id)
      .map(e => ({ label: e.title, value: e.id }))
  }
}

export const getOptions = (tiles: Tile[], entries: TileEntry[]) => {
  return tiles
    .filter(t => (t.content !== "PREDICTION") && (t.content !== "LEARNING_OUTCOMES"))
    .map(t => getOptionsForTile(t, entries))
}
