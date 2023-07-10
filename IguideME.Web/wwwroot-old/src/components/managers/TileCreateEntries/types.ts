import {Tile, TileContentTypes, TileEntry, TileTypeTypes} from "../../../models/app/Tile";
import {LearningGoal} from "../../../models/app/LearningGoal";
import GoalEntry from "./LearningGoalsManager/GoalEntry";

export interface AssignmentRegistry {
  canvas_id: number;
  name: string;
  published: boolean;
  onCanvas: boolean;
  position: number;
  graphView: boolean;
}

export interface IProps {
  graphView: boolean;
  setGraphView: (val: boolean) => any;
  updateGoals: (goals: LearningGoal[]) => any;
  updateEntries: (entries: TileEntry[]) => any;
  tile: undefined | Tile;
  contentType: TileContentTypes | undefined;
  tileType: TileTypeTypes | undefined;
  wildcard: boolean;
  setWildcard: (val: boolean) => any;
}

export interface IState {
  loading: boolean;
  activeGoals: LearningGoal[];
  activeEntries: TileEntry[];
}

export interface IManagerProps {
  tile: Tile | undefined;
  addEntry: (entry: TileEntry) => any;
  removeEntry: (entry: TileEntry) => any;
}