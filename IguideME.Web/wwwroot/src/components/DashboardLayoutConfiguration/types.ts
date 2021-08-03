import {DashboardColumn} from "../../models/app/Layout";
import {Tile, TileGroup} from "../../models/app/Tile";

export interface IProps {
}

export interface IState {
  loaded: boolean;
  columns: DashboardColumn[];
  tileGroups: TileGroup[];
}