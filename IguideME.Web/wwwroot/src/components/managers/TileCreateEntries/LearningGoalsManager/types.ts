import {LearningGoal} from "../../../../models/app/LearningGoal";
import {Tile} from "../../../../models/app/Tile";

export interface IProps {
  tile: Tile | undefined;
  goals: LearningGoal[];
  setGoals: (goals: LearningGoal[]) => any;
}

export interface IState {
}