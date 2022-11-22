import {TilesGradeSummary} from "../components/StudentDashboard/types";
const compute = require( 'compute.io' );

export const getAverageGrade = (submissions: TilesGradeSummary[],
                                precision: number = 2): number | null => {
  const grades = submissions.map(s => s.average);

  if (grades.length === 0) return null;

  return Math.round(compute.mean(grades) * (10 ** precision)) / (10 ** precision);
}