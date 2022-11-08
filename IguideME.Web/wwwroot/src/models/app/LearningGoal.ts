import {editState} from "./Tile"

export interface LearningGoal {
  id: number;
  state: editState;
  tile_id: number;
  title: string;
  requirements: GoalRequirement[];
}

export interface GoalRequirement {
  id: number;
  state:editState;
  goal_id: number;
  tile_id: number;
  entry_id: number | string;
  meta_key: string | null;
  value: number;
  expression: string | null;
}

export interface LearningOutcome {
  success: boolean;
  goal: LearningGoal;
}