import type { ReactElement } from 'react';

import { PassRateBarGraph } from './graphs/pass-rate-bar-graph';
import type { GradeCorrelationProps } from './grade-correlation';
import type { UserGrade } from '@/types/grades';
import { Card } from 'antd';

function Statistics({ grades }: { grades: UserGrade[] }): ReactElement {
  const sortedGrades = grades.sort((a, b) => a.grade - b.grade);
  const averageGrade = sortedGrades.reduce((acc, grade) => acc + grade.grade, 0) / sortedGrades.length;
  const passRate = (grades.filter((grade) => grade.grade >= 55).length / grades.length) * 100;

  return (
    <Card size='small' title={<h3 className='text-base text-text'>Pass rate statistics</h3>}>
      {grades.length === 0 ?
        <p className='text-muted-foreground text-sm'>No grades available</p>
      : <div className='[&>p]:text-sm'>
          <p>Minium grade: {sortedGrades[0]?.grade.toFixed(1)}</p>
          <p>Average grade: {averageGrade.toFixed(1)}</p>
          <p>Maximum grade: {sortedGrades[sortedGrades.length - 1]?.grade.toFixed(1)}</p>
          <p>Pass rate: {passRate.toFixed(1)}%</p>
        </div>
      }
    </Card>
  );
}

export function PassRate({ gradesA, gradesB, compareTitles }: GradeCorrelationProps): ReactElement {
  return (
    <div className='flex w-full flex-col gap-8 lg:flex-row'>
      <Card
        size='small'
        title={
          <h2 className='text-lg'>
            {compareTitles.a.length === 0 ?
              <span className='text-destructive'>No title found</span>
            : compareTitles.a}
          </h2>
        }
        className='flex-1'
      >
        <div className='flex w-full flex-wrap gap-8'>
          <Statistics grades={gradesA} />
          <PassRateBarGraph grades={gradesA} />
        </div>
      </Card>

      <Card
        size='small'
        title={
          <h2 className='text-lg'>
            {compareTitles.b.length === 0 ?
              <span className='text-destructive'>No title found</span>
            : compareTitles.b}
          </h2>
        }
        className='flex-1'
      >
        <div className='flex w-full flex-wrap gap-8'>
          <Statistics grades={gradesB} />
          <PassRateBarGraph grades={gradesB} />
        </div>
      </Card>
    </div>
  );
}
