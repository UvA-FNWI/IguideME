import {Tile, TileEntry} from "../../models/app/Tile";

export interface IProps {
  tile: Tile;
  editTile: () => any;
  deleteTile: (id: number) => any;
}

export interface IState {
  tile: Tile | undefined;
  entriesLoaded: boolean;
  entries: TileEntry[];
  updatingNotifications: number[];
}
