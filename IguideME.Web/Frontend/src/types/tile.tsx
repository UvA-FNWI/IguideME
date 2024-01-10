export interface LayoutColumn {
  id: number;
  width: number;
  position: number;
  groups: number[];
}

export interface TileGroup {
  id: number;
  title: string;
  position: number;
}

export interface Tile {
  id: number;
  group_id: number;
  title: string;
  position: number;
  type: TileType;
  weight: number;
  visible: boolean;
  notifications: boolean;
  gradingType: GradingType;
  entries: TileEntry[];
}

export enum TileType {
  assignments,
  discussions,
  learning_outcomes,
}

export interface TileEntry {
  tile_id: number;
  title: string;
  weight: number;
  content_id: number;
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  published: boolean;
  muted: boolean;
  due_date: number;
  max_grade: number;
  grading_type: GradingType;
}

export interface Discussion {
  id: number;
  type: DiscussionType;
  parent_id: number;
  course_id: number;
  title: string;
  author: string;
  date: number;
  message: string;
}

export interface LearningGoal {
  id: number;
  title: string;
  requirements: GoalRequirements[];
}

export enum GradingType {
  PassFail = "pass_fail",
  Percentage = "percent",
  Letters = "letter_grade",
  GPA = "gpa_scale",
  Points = "points",
  NotGraded = "not_graded",
}

export const printGradingType = (type: GradingType): string => {
  switch (type) {
    case GradingType.PassFail:
      return "Pass/Fail";
    case GradingType.Percentage:
      return "Percentage";
    case GradingType.Letters:
    case GradingType.GPA:
      return "Letters/GPA";
    case GradingType.Points:
      return "Points";
    case GradingType.NotGraded:
      return "Not Graded";
  }
};

export enum DiscussionType {
  Topic,
  Entry,
  Reply,
}

export enum LogicalExpression {
  Less,
  LessEqual,
  Equal,
  GreaterEqual,
  Greater,
  NotEqual,
}

export interface GoalRequirements {
  id: number;
  goal_id: number;
  tile_id: number;
  assignment_id: number;
  value: number;
  expression: LogicalExpression;
}
