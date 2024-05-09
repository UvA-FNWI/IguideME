import tailwindConfig from '@/../tailwind.config';
import GraphGrade from '@/components/atoms/graph-grade/graph-grade';
import { TooltipProps } from '@/types/reactRecharts';
import { TileType, type Grades } from '@/types/tile';
import { memo, type FC, type ReactElement } from 'react';
import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts';
import resolveConfig from 'tailwindcss/resolveConfig';

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

const GraphLearning: FC<Grades> = memo(({ grade, peerAvg, max }): ReactElement => {
  const RadialBarTooltip: FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='z-50 rounded-lg border border-solid border-text bg-body p-2'>
          <p>
            Completed: {Math.round(payload[0].value)}/{max}
          </p>
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
          grade: grade,
          fill: fullConfig.theme.colors.graph.you,
        },
        {
          name: 'Peer',
          grade: peerAvg,
          fill: fullConfig.theme.colors.graph.peer,
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
      <RadialBar background className='[&>g>path]:!fill-graph-max' dataKey='grade' />
      <Legend align='right' layout='vertical' verticalAlign='top' />
      {/* @ts-ignore */}
      <Tooltip content={<RadialBarTooltip />} />
      <PolarAngleAxis type='number' domain={[0, max]} angleAxisId={0} tick={false} />
    </RadialBarChart>
  );
});
GraphLearning.displayName = 'GraphLearning';
export default GraphTile;
