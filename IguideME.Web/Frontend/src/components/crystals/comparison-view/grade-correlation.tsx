import type { ReactElement } from 'react';

import { CorrelationGraph } from './graphs/correlation-graph';
import { varFixed, type UserGrade } from '@/types/grades';
import type { CompareTitles } from '@/components/pages/admin/analyzer/analyzer';
import { Card } from 'antd';

function CorrelationStatistics({ gradeData }: { gradeData: GradeData[] }): ReactElement {
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let minX = 100;
  let minY = 100;
  let maxX = 0;
  let maxY = 0;

  const dataCount = gradeData.length;

  gradeData.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
    minX = minX > x ? x : minX;
    minY = minY > y ? y : minY;
    maxX = maxX < x ? x : maxX;
    maxY = maxY < y ? y : maxY;
  });

  const correlationCoefficient =
    (dataCount * sumXY - sumX * sumY) /
    (Math.sqrt(dataCount * sumXX - sumX * sumX) * Math.sqrt(dataCount * sumYY - sumY * sumY));
  const averageX = sumX / dataCount;
  const averageY = sumY / dataCount;
  const stdDevX = Math.sqrt(
    gradeData.reduce((sum, { x }) => sum + (x - averageX) * (x - averageX), 0) / (dataCount - 1),
  );
  const stdDevY = Math.sqrt(
    gradeData.reduce((sum, { y }) => sum + (y - averageY) * (y - averageY), 0) / (dataCount - 1),
  );

  return (
    <Card size='small' title={<h3 className='text-text text-base'>Correlation statistics</h3>}>
      <div className='[&>p]:text-sm'>
        <p>Correlation Coefficient: {correlationCoefficient.toFixed(5)}</p>
        <p>Average X: {varFixed(averageX)}</p>
        <p>Average Y: {varFixed(averageY)}</p>
        <p>Data Count (size): {dataCount}</p>
        <p>Standard Deviation X: {varFixed(stdDevX)}</p>
        <p>Standard Deviation Y: {varFixed(stdDevY)}</p>
        <p>Minimum X: {varFixed(minX)}</p>
        <p>Minimum Y: {varFixed(minY)}</p>
        <p>Maximum X: {varFixed(maxX)}</p>
        <p>Maximum Y: {varFixed(maxY)}</p>
      </div>
    </Card>
  );
}

interface GradeCorrelationProps {
  gradesA: UserGrade[];
  gradesB: UserGrade[];
  compareTitles: CompareTitles;
}

interface GradeData {
  x: number;
  y: number;
}

function GradeCorrelation({ gradesA, gradesB, compareTitles }: GradeCorrelationProps): ReactElement {
  const gradeData: GradeData[] = gradesA
    .map((gradeA) => {
      const correspondingGradeB = gradesB.find((gradeB) => gradeB.userID === gradeA.userID);
      return correspondingGradeB ? { x: gradeA.grade, y: correspondingGradeB.grade } : undefined;
    })
    .filter((gradePair) => gradePair !== undefined);

  return (
    <div className='flex min-h-[50vh] flex-col justify-between gap-8 lg:flex-row'>
      <div className='w-fit shrink-0'>
        {gradeData.length === 0 ?
          <Card size='small' title={<h3 className='text-base'>Correlation statistics</h3>} className='flex-1'>
            <p className='text-destructive max-w-60 text-sm'>
              No comparison possible. This might be because one of the two tiles or entries have no grades.
            </p>
          </Card>
        : <CorrelationStatistics gradeData={gradeData} />}
      </div>
      <div className='flex-1'>
        <CorrelationGraph gradeData={gradeData} compareTitles={compareTitles} />
      </div>
    </div>
  );
}

export type { GradeCorrelationProps, GradeData };
export { GradeCorrelation };
