import { Bullet } from '@ant-design/charts';
import { Col, Row } from 'antd';
import { useTheme } from 'next-themes';
import { printGrade, type Grades } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

const GraphGrade: FC<Grades> = ({ grade, peerAvg, peerMin, peerMax, max, type }): ReactElement => {
  const { theme } = useTheme();

  const studentdata = [
    {
      title: 'You',
      Grade: grade,
      Max: 100,
    },
  ];
  const peerdata = [
    {
      title: 'Peers',
      'Peer avg': peerAvg,
      ranges: [peerMin, peerMax, 100],
    },
  ];

  const config = {
    layout: 'vertical',
    padding: 10,
    paddingBottom: 20,
    paddingTop: 0,
    axis: {
      x: {
        labelFill: theme === 'light' ? 'black' : 'white',
      },
      y: { label: false, tick: false, grid: false },
    },
    tooltip: {
      title: '',
      items: [
        {
          channel: 'y',
          valueFormatter: (val: number) => printGrade(type, val, max),
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
            Max: [theme === 'dark' ? '#878787' : '#f6f8fa'],
            Grade: '#5a32ff',
          }}
          {...config}
        />
      </Col>
      <Col span={12} className='h-full'>
        <Bullet
          data={peerdata}
          measureField='Peer avg'
          color={{
            ranges:
              theme === 'dark' ? ['#878787', '#8c61ff', '#878787'] : ['#f6f8fa', 'rgba(255, 50, 50, .3)', '#f6f8fa'],
            'Peer avg': theme === 'dark' ? '#c4a4ff' : 'rgba(255, 50, 50, .8)',
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
