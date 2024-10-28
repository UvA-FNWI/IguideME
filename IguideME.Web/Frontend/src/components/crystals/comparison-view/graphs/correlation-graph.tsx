import type { ReactElement } from 'react';
import { CartesianGrid, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import type { GradeData } from '../grade-correlation';
import type { CompareTitles } from '@/components/pages/admin/analyzer/analyzer';

export function CorrelationGraph({
  gradeData,
  compareTitles,
}: {
  gradeData: GradeData[];
  compareTitles: CompareTitles;
}): ReactElement {
  return (
    <ResponsiveContainer className='min-h-80 w-full min-w-80 max-w-[800px]'>
      <ScatterChart margin={{ top: 10, right: 0, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type='number' dataKey='x' name={compareTitles.a}>
          <Label value={compareTitles.a} position='bottom' offset={0} />
        </XAxis>
        <YAxis type='number' dataKey='y' name={compareTitles.b}>
          <Label value={compareTitles.b} angle={270} position='left' offset={0} />
        </YAxis>
        <Scatter data={gradeData} fill='hsl(var(--primary))' />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
