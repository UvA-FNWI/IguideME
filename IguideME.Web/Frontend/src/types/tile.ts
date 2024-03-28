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

export interface TileGrades {
  tile_id: number;
  grade: number;
  peerMin: number;
  peerAvg: number;
  peerMax: number;
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
  requirements: GoalRequirement[];
}

export enum GradingType {
  PassFail,
  Percentage,
  Letters,
  Points,
  NotGraded,
}

export const printGradingType = (type: GradingType): string => {
  switch (type) {
    case GradingType.PassFail:
      return 'Pass/Fail';
    case GradingType.Percentage:
      return 'Percentage';
    case GradingType.Letters:
      return 'Letters';
    case GradingType.Points:
      return 'Points';
    case GradingType.NotGraded:
      return 'Not Graded';
  }
};

export const printGrade = (type: GradingType, grade: number, max: number, ng: boolean = true): string => {
  switch (type) {
    case GradingType.PassFail:
      return grade > 0 ? 'Pass' : 'Fail';
    case GradingType.Percentage:
      return grade.toFixed(1) + '%';
    case GradingType.Letters:
      return letterGrade(grade);
    case GradingType.Points:
      return ((grade * max) / 100).toFixed(2) + '/' + max;
    case GradingType.NotGraded:
      return ng ? 'N/A' : grade.toFixed(0);
  }
};

const letterGrade = (grade: number): string => {
  if (grade > 93) return 'A';
  if (grade > 89) return 'A-';
  if (grade > 86) return 'B+';
  if (grade > 83) return 'B';
  if (grade > 79) return 'B-';
  if (grade > 76) return 'C+';
  if (grade > 73) return 'C';
  if (grade > 69) return 'C-';
  if (grade > 66) return 'D+';
  if (grade > 63) return 'D';
  if (grade > 60) return 'D-';
  return 'F';
};
export interface Grades {
  grade: number;
  peerAvg: number;
  peerMin: number;
  peerMax: number;
  max: number;
  type: GradingType;
}

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

export interface GoalRequirement {
  id: number;
  goal_id: number;
  assignment_id: number;
  value: number;
  expression: LogicalExpression;
}

export interface Submission {
  id: number;
  assignmentID: number;
  userID: string;
  grades: Grades;
  date: number;
}
