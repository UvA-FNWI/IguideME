'use client';

import { type ReactElement, useMemo } from 'react';
import { Bar, BarChart, Label, LabelList, ReferenceLine, XAxis, YAxis } from 'recharts';
import { useShallow } from 'zustand/react/shallow';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useGlobalContext } from '@/stores/global-store/use-global-store';

export function PredictedGradeGraph(): ReactElement {
  const { student } = useGlobalContext(useShallow((state) => ({ student: state.student })));

  const { goal, total, predicted }: { goal: number; total: number; predicted: number } = {
    goal: student?.settings?.goal_grade ?? 0,
    total: student?.settings?.total_grade ?? 0,
    predicted: student?.settings?.predicted_grade ?? 0,
  };

  const chartData = useMemo(() => {
    return [
      {
        name: 'Current grade',
        grade: total.toFixed(1),
      },
      {
        name: 'Predicted grade',
        grade: predicted.toFixed(1),
      },
    ];
  }, [predicted, total]);

  const chartConfig = useMemo(() => {
    return {
      grade: {
        label: 'Grade',
        color: 'hsl(var(--chart-1))',
      },
      label: {
        color: 'hsl(var(--background))',
      },
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison of Current and Predicted Grades</CardTitle>
        <CardDescription>
          This graph illustrates the comparison between your current grade and the AI-predicted final grade, helping you
          to monitor your progress towards your goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-40 w-full' config={chartConfig satisfies ChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              top: 20,
              left: 10,
              right: 16,
            }}
          >
            <XAxis type='number' dataKey='grade' domain={[0, 10]} ticks={[0, 5, 10]} />
            <YAxis dataKey='name' type='category' tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
            <Bar dataKey='grade' fill='hsl(var(--chart-1))' radius={5}>
              <LabelList className='fill-foreground' dataKey='grade' fontSize={12} offset={8} position='right' />
            </Bar>
            <ReferenceLine
              className='stroke-foreground [&>line]:!stroke-foreground'
              strokeDasharray='3 3'
              strokeWidth={2}
              x={goal}
            >
              <Label value='goal' position='top' />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
