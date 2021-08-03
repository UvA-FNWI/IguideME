import {Tile} from "../../../models/app/Tile";

export interface IProps {
  editTile: () => any;
  tile: Tile;
}

export interface IState {
  loading: boolean;
  tile: Tile | undefined;
}