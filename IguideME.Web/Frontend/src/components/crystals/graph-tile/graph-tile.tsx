import { type Grades, TileType } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

import { Bullet, RadialBar } from '@ant-design/charts';
import { Col, Row } from 'antd';

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

const GraphGrade: FC<Grades> = ({ grade, peerAvg, peerMin, peerMax, max }): ReactElement => {
  const studentData = [
    {
      title: 'You',
      Grade: grade,
      Max: max,
    },
  ];

  const peerData = [
    {
      title: 'Peers',
      'Peer avg': peerAvg,
      ranges: [peerMin, peerMax, max],
    },
  ];

  const config = {
    layout: 'vertical',
    padding: 10,
    paddingBottom: 20,
    paddingTop: 0,
    axis: {
      y: { label: false, tick: false, grid: false },
    },
    tooltip: {
      title: '',
      items: [
        {
          channel: 'y',

          valueFormatter: '.2f',
        },
      ],
    },
    range: {
      style: {
        minWidth: 50,
      },
    },
    measure: {
      style: {
        minWidth: 40,
      },
    },
    target: {
      sizeField: 30,
    },
    legend: { color: { position: 'bottom' } },
  };

  return (
    <Row className="h-full">
      <Col span={12} className="h-full">
        <Bullet
          data={studentData}
          rangeField="Max"
          measureField="Grade"
          color={{
            Max: ['#f6f8fa'],
            Grade: BLUE,
          }}
          {...config}
        />
      </Col>
      <Col span={12} className="h-full">
        <Bullet
          data={peerData}
          measureField="Peer avg"
          color={{
            ranges: ['#f6f8fa', 'rgba(255, 50, 50, .3)', '#f6f8fb'],
            'Peer avg': RED,
          }}
          {...config}
          mapField={{
            measures: 'Peer avg',
            ranges: ['Max', 'Peer max', 'Peer min'],
            target: '',
          }}
        />
      </Col>{' '}
    </Row>
  );
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
