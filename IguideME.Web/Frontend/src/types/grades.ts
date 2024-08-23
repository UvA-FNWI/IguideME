export interface Submission {
  id: number;
  assignmentID: number;
  userID: string;
  grades: Grades;
  date: number;
}

export interface Grades {
  grade: number;
  peerAvg: number;
  peerMin: number;
  peerMax: number;
  max: number;
  type: GradingType;
}

export interface TileGrade {
  tile_id: number;
  grade: number;
  max: number;
}

export interface UserGrade {
  userID: string;
  grade: number;
  max: number;
}

export enum GradingType {
  PassFail,
  Percentage,
  Letters,
  Points,
  NotGraded,
}

export const printGrade = (type: GradingType, grade: number, max: number, ng = true): string => {
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

export const varFixed = (nr: number): string => {
  const result = nr.toFixed(1);
  return result.endsWith('0') ? result.slice(0, -2) : result;
};

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
