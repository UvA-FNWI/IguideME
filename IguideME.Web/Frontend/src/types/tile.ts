import { Grades, GradingType } from './grades';

export type ViewType = 'graph' | 'grid';

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
  alt: boolean;
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

export interface DiscussionTopic {
  id: number;
  parent_id: number;
  course_id: number;
  title: string;
  author: string;
  date: number;
  message: string;
  grades?: Grades;
}

export interface DiscussionEntry {
  id: number;
  discussion_id: number;
  parent_id: number;
  course_id: number;
  author: string;
  date: number;
  message: string;
}

export interface LearningGoal {
  id: number;
  title: string;
  requirements: GoalRequirement[];
  results?: boolean[];
}

export enum LogicalExpression {
  Less,
  LessEqual,
  Equal,
  GreaterEqual,
  Greater,
  NotEqual,
}

export const printLogicalExpression = (expression: LogicalExpression): string => {
  switch (expression) {
    case LogicalExpression.NotEqual:
      return '≠';
    case LogicalExpression.Less:
      return '<';
    case LogicalExpression.LessEqual:
      return '≤';
    case LogicalExpression.Equal:
      return '=';
    case LogicalExpression.GreaterEqual:
      return '≥';
    case LogicalExpression.Greater:
      return '>';
  }
};

export interface GoalRequirement {
  id: number;
  goal_id: number;
  assignment_id: number;
  value: number;
  expression: LogicalExpression;
}
