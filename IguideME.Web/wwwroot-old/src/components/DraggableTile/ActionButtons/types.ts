import {Tile} from "../../../models/app/Tile";

export interface IProps {
  editTile: () => any;
  deleteTile: (id: number) => any;
  tile: Tile;
}

export interface IState {
  loading: boolean;
  tile: Tile | null;
}