import { Bullet } from '@ant-design/charts';
import { Col, Row } from 'antd';
import { type Grades } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

const BLUE = 'rgba(90, 50, 255, .9)';
const RED = 'rgba(255, 50, 50, .8)';

const GraphGrade: FC<Grades> = ({ grade, peerAvg, peerMin, peerMax, max }): ReactElement => {
  const studentdata = [
    {
      title: 'You',
      Grade: grade,
      Max: max,
    },
  ];
  const peerdata = [
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
    <Row className='h-full'>
      <Col span={12} className='h-full'>
        <Bullet
          data={studentdata}
          rangeField='Max'
          measureField='Grade'
          color={{
            Max: ['#f6f8fa'],
            Grade: BLUE,
          }}
          {...config}
        />
      </Col>
      <Col span={12} className='h-full'>
        <Bullet
          data={peerdata}
          measureField='Peer avg'
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

export default GraphGrade;
