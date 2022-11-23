import {Tile, TileContentTypes, TileEntry, TileGroup, TileTypeTypes} from "../../../../../../models/app/Tile";
import {LearningGoal} from "../../../../../../models/app/LearningGoal";

export interface IProps {
  tile: undefined | Tile;
  isOpen: boolean;
  setOpen: (value: boolean) => any;
  tiles: Tile[];
  tileGroup: TileGroup;
  updateTiles: (tiles: Tile[]) => any;
}

export interface IState {
  updating: boolean;
  title: string;
  graphView: boolean;
  contentType: { label: string | undefined, value: TileContentTypes | undefined };
  tileType: { label: string | undefined, value: TileTypeTypes | undefined };
  visible: boolean;
  wildcard: boolean;
  entries: TileEntry[];
  goals: LearningGoal[];
}