import GraphGrade from '@/components/atoms/graph-grade/graph-grade';
import { RadialBar } from '@ant-design/charts';
import { type Grades, TileType } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

const BLUE = 'rgba(90, 50, 255, .9)';
const RED = 'rgba(255, 50, 50, .8)';
interface Props {
  type: TileType;
  grades: Grades;
}
const GraphTile: FC<Props> = ({ type, grades }): ReactElement => {
  switch (type) {
    case TileType.assignments:
    case TileType.discussions:
      return <GraphGrade {...grades} />;
    case TileType.learning_outcomes:
      return <GraphLearning {...grades} />;
  }
};

const GraphLearning: FC<Grades> = ({ grade, peerAvg, max }): ReactElement => {
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
      fill: (data: any) => {
        if (data.name === 'You') {
          return BLUE;
        }
        return RED;
      },
    },
    axis: {
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
    <div className="h-full">
      <RadialBar {...config} />
    </div>
  );
};

export default GraphTile;
