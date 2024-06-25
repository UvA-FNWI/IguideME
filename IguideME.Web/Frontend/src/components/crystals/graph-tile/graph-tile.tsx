import GraphGrade from '@/components/atoms/graph-grade/graph-grade';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts';
import { type TooltipProps } from '@/types/reactRecharts';
import { TileType, printGrade, type Grades } from '@/types/tile';
import { memo, type FC, type ReactElement } from 'react';

interface Props {
  type: TileType;
  grades: Grades;
}

const GraphTile: FC<Props> = memo(({ type, grades }): ReactElement => {
  switch (type) {
    case TileType.assignments:
    case TileType.discussions:
      return <GraphGrade {...grades} />;
    case TileType.learning_outcomes:
      return <GraphLearning {...grades} />;
  }
});
GraphTile.displayName = 'GraphTile';

const GraphLearning: FC<Grades> = memo(({ type, grade, peerAvg, max }): ReactElement => {
  const RadialBarTooltip: FC<TooltipProps> = ({ active, payload }) => {
    console.log('payload', payload);
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className='z-50 rounded-lg border border-solid border-text bg-surface1/85 p-2'>
          <p>Completed: {printGrade(type, data.grade, max)}</p>
        </div>
      );
    }

    return null;
  };

  const fullConfig = resolveConfig(tailwindConfig);

  return (
    <RadialBarChart
      data={[
        {
          name: 'You',
          grade,
          fill: fullConfig.theme.colors.primary,
        },
        {
          name: 'Peer',
          grade: peerAvg,
          fill: fullConfig.theme.colors.secondary,
        },
      ]}
      cx='50%'
      cy='50%'
      innerRadius='40%'
      outerRadius='100%'
      barSize={30}
      startAngle={0}
      endAngle={-270}
      width={250}
      height={180}
    >
      <RadialBar background className='[&>g>path]:!fill-overlay0' dataKey='grade' />
      <Legend align='right' layout='vertical' verticalAlign='top' />
      <Tooltip content={<RadialBarTooltip />} />
      <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
    </RadialBarChart>
  );
});
GraphLearning.displayName = 'GraphLearning';
export default GraphTile;
