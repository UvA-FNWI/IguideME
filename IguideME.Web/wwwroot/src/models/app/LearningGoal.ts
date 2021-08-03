export interface LearningGoal {
  id: number;
  tile_id: number;
  title: string;
  requirements: GoalRequirement[];
}

export interface GoalRequirement {
  id: number;
  goal_id: number;
  tile_id: number;
  entry_id: number;
  meta_key: string;
  value: number;
  expression: "lte" | "gte" | "e" | null;
}