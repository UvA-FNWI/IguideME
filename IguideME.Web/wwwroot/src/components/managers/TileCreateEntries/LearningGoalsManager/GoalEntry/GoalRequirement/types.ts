import {GoalRequirement} from "../../../../../../models/app/LearningGoal";

export interface IProps {
  requirement: GoalRequirement;
  updateRequirement: (requirement: GoalRequirement) => any;
  removeRequirement: (id: number) => any;
}