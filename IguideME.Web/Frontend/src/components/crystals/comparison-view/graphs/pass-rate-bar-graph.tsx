import type { UserGrade } from '@/types/grades';
import type { ReactElement } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';

export function PassRateBarGraph({ grades }: { grades: UserGrade[] }): ReactElement {
  const chartData = Array.from({ length: 11 }, (_, i) => ({
    grade: i,
    failed: 0,
    passed: 0,
  }));

  grades.forEach(({ grade }) => {
    const viewingGrade = Math.round(grade / 10);
    const existingGrade = chartData.find((data) => data.grade === Math.round(viewingGrade));
    if (existingGrade) {
      if (viewingGrade < 5.5) {
        existingGrade.failed += 1;
      } else {
        existingGrade.passed += 1;
      }
    } else {
      chartData.push({
        grade: viewingGrade,
        failed: viewingGrade < 5.5 ? 1 : 0,
        passed: viewingGrade >= 5.5 ? 1 : 0,
      });
    }
  });

  return (
    <ResponsiveContainer className='min-h-44 flex-1 flex-grow'>
      <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine dataKey='grade' interval={0} tickLine tickMargin={10} />
        <Bar dataKey='failed' stackId='a' fill='hsl(var(--failure))' radius={[0, 0, 4, 4]} />
        <Bar dataKey='passed' stackId='a' fill='hsl(var(--success))' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
