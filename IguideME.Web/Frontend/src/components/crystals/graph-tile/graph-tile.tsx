import GraphGrade from '@/components/atoms/graph-grade/graph-grade';
import { RadialBar } from '@ant-design/charts';
import { useTheme } from 'next-themes';
import { type Grades, TileType } from '@/types/tile';
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

const GraphLearning: FC<Grades> = memo(({ grade, peerAvg, max }): ReactElement => {
  const { theme } = useTheme();

  const data = [
    {
      name: 'You',
      Grade: grade,
    },
    {
      name: 'Peer',
      Grade: peerAvg,
    },
  ];
  const config = {
    data,
    padding: 0,
    margin: 0,
    paddingBottom: 20,
    xField: 'name',
    yField: 'Grade',
    startAngle: 0,
    maxAngle: 360,
    radius: 1.4,
    innerRadius: 0.3,
    scale: {
      y: {
        domain: [0, 100],
      },
    },
    style: {
      fill: ({ name }: { name: 'You' | 'Peer' }) => {
        if (name === 'You') return '#5a32ff';
        else return theme === 'dark' ? '#b38dff' : 'rgba(255, 50, 50, .8)';
      },
    },
    axis: {
      x: {
        labelFill: theme === 'light' ? 'black' : 'white',
      },
      y: { label: false, tick: false, grid: false },
    },
    markBackground: { color: 'color', opacity: 0.15 },
    tooltip: {
      title: '',
      items: [
        {
          name: 'Completed',
          field: 'Grade',
          valueFormatter: (d: number) => d.toFixed(0) + '/' + max,
        },
      ],
    },
  };
  return (
    <div className='h-full'>
      <RadialBar {...config} />
    </div>
  );
});
GraphLearning.displayName = 'GraphLearning';
export default GraphTile;
