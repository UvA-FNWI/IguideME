import {Tile, TileGroup} from "../../../../../models/app/Tile";

export const getStyle = (group: TileGroup, tiles: Tile[]) => {

  if (tiles.filter((tile: Tile) => tile.group_id === group.id).length === 0) {
    return {
      width: '100%',
      minHeight: 200,
      border: "2px dotted #EAEAEA",
      borderRadius: 5,
    }
  }

  return {}
}

export const handleDrop = async (group: TileGroup,
                                 evt: { removedIndex: number | null, addedIndex: number | null, payload?: Tile },
                                 tiles: Tile[]): Promise<Tile[]> => {
  const { addedIndex, payload, removedIndex } = evt;
  void payload; // discard while keeping eslint happy

  let tilesInGroup: Tile[] = JSON.parse(JSON.stringify(getTilesInGroup(tiles, group.id)));

  if (removedIndex !== null && addedIndex !== null) {
    const dragged = tilesInGroup[removedIndex - 1];
    tilesInGroup.splice(addedIndex, 0, dragged);

    if (removedIndex < addedIndex)
      tilesInGroup = tilesInGroup.filter((t, i) => i !== removedIndex - 1);
    else
      tilesInGroup = tilesInGroup.filter((t, i) => i !== removedIndex);

    for (let i = 0; i < tilesInGroup.length; i ++) {
      tilesInGroup[i].position = i + 1;
    }

    tiles = [
      ...tiles.filter(t => !tilesInGroup.map(x => x.id).includes(t.id)),
      ...tilesInGroup
    ];

    return Promise.resolve(tiles);
  } else {
    return Promise.resolve(tiles);
  }
}

export const getTilesInGroup = (tiles: Tile[], groupId: number) => {
  return tiles.filter(
    (tile: Tile) => tile.group_id === groupId)
    .sort(
      (a: Tile, b: Tile) => a.position - b.position
    );
}