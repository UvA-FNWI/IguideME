import {Tile, TileGroup} from "../../../../models/app/Tile";

export interface IProps {

}

export interface IState {
  loaded: boolean;
  tiles: Tile[];
  tileGroups: TileGroup[];
}