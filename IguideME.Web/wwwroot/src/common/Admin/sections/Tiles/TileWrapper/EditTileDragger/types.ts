import {Tile, TileContentTypes, TileEntry, TileGroup, TileTypeTypes} from "../../../../../../models/app/Tile";
import {AssignmentRegistry} from "../../../../../../components/managers/TileCreateEntries/types";
import GoalEntry from "../../../../../../components/managers/TileCreateEntries/LearningGoalsManager/GoalEntry";
import {LearningGoal} from "../../../../../../models/app/LearningGoal";

export interface IProps {
  tile: undefined | Tile;
  isOpen: boolean;
  setOpen: (value: boolean) => any;
  tiles: Tile[];
  tileGroup: TileGroup;
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