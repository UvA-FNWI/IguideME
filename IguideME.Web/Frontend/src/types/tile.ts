type ViewType = 'summary' | 'graph' | 'grid';

interface TileGroup {
  id: number;
  title: string;
  position: number;
}

interface Tile {
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

interface TileGrades {
  tile_id: number;
  grade: number;
  peerMin: number;
  peerAvg: number;
  peerMax: number;
  max: number;
}

enum TileType {
  Assignments,
  Discussions,
  LearningOutcomes,
}

interface TileEntry {
  tile_id: number;
  title: string;
  weight: number;
  content_id: number;
}

interface Assignment {
  id: number;
  course_id: number;
  title: string;
  published: boolean;
  muted: boolean;
  due_date: number;
  max_grade: number;
  grading_type: GradingType;
}

interface DiscussionTopic {
  id: number;
  parent_id: number;
  course_id: number;
  title: string;
  author: string;
  date: number;
  message: string;
  grades?: Grades;
}

interface DiscussionEntry {
  id: number;
  discussion_id: number;
  parent_id: number;
  course_id: number;
  author: string;
  date: number;
  message: string;
}

interface LearningGoal {
  id: number;
  title: string;
  requirements: GoalRequirement[];
  results?: boolean[];
}

enum GradingType {
  PassFail,
  Percentage,
  Letters,
  Points,
  NotGraded,
}

const printGradingType = (type: GradingType): string => {
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

const printGrade = (type: GradingType, grade: number, max: number, ng = true): string => {
  switch (type) {
    case GradingType.PassFail:
      return grade > 0 ? 'Pass' : 'Fail';
    case GradingType.Percentage:
      return `${varFixed(grade)}%`;
    case GradingType.Letters:
      return letterGrade(grade);
    case GradingType.Points:
      if (max > 0) {
        const result = (grade * max) / 100;

        return `${varFixed(result)}/${varFixed(max)}`;
      }

      return grade.toFixed(0);

    case GradingType.NotGraded:
      return ng ? 'N/A' : (max > 0 ? (grade * max) / 100 : grade).toFixed(0);
  }
};

const varFixed = (nr: number): string => {
  const result = nr.toFixed(1);
  return result.endsWith('0') ? result.slice(0, -2) : result;
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

// TODO collapse together with tileGrades
interface Grades {
  grade: number;
  peerAvg: number;
  peerMin: number;
  peerMax: number;
  max: number;
  type: GradingType;
}

enum LogicalExpression {
  Less,
  LessEqual,
  Equal,
  GreaterEqual,
  Greater,
  NotEqual,
}

const printLogicalExpression = (expression: LogicalExpression): string => {
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

interface GoalRequirement {
  id: number;
  goal_id: number;
  assignment_id: number;
  value: number;
  expression: LogicalExpression;
}

interface Submission {
  id: number;
  assignmentID: number;
  userID: string;
  grades: Grades;
  date: number;
}

export {
  GradingType,
  letterGrade,
  LogicalExpression,
  printGrade,
  printGradingType,
  printLogicalExpression,
  TileType,
  varFixed,
};
export type {
  Assignment,
  DiscussionEntry,
  DiscussionTopic,
  GoalRequirement,
  Grades,
  LearningGoal,
  Submission,
  Tile,
  TileEntry,
  TileGrades,
  TileGroup,
  ViewType,
};
