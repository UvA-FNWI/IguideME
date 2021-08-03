import {Tile, TileGroup} from "../../../models/app/Tile";

export interface IProps {
  tile: Tile;
  tileGroup: TileGroup;
}

export interface IState {
  uploadMenuOpen: boolean;
}