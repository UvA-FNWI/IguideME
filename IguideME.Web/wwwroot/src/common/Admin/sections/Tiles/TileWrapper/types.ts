import {Tile, TileGroup} from "../../../../../models/app/Tile";

export interface IProps {
  group: TileGroup;
  tiles: Tile[];
  updateTiles: (group: TileGroup, tiles: Tile[]) => any;
}

export interface IState {
  updating: number[];
  editTile: undefined | Tile;
  isDraggerOpen: boolean;
}