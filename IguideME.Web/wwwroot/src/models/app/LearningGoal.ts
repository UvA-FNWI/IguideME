export interface LearningGoal {
  id: number;
  new?: boolean;
  tile_id: number;
  title: string;
  requirements: GoalRequirement[];
}

export interface GoalRequirement {
  id: number;
  goal_id: number;
  tile_id: number;
  entry_id: number | string;
  meta_key: string | null;
  value: number;
  expression: "lte" | "gte" | "e" | null;
}

export interface LearningOutcome {
  success: boolean;
  goal: LearningGoal;
}