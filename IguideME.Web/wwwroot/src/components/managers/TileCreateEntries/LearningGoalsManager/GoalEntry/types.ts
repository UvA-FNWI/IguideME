import {GoalRequirement, LearningGoal} from "../../../../../models/app/LearningGoal";
import {Tile} from "../../../../../models/app/Tile";

export interface IProps {
  tile: Tile | undefined,
  goal: LearningGoal;
  updateGoal: (goal: LearningGoal) => any;
}

export interface IState {
  requirements: GoalRequirement[]
}