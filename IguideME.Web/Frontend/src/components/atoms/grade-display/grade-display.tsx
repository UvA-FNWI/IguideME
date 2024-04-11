import { FrownTwoTone, MehTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { type FC, type ReactElement } from 'react';

import { Bar, type BarConfig } from '@ant-design/charts';

const GradeDisplay: FC = (): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

  if (user.settings === undefined) {
    return <Spin spinning />;
  }

  const goal = user.settings.goal_grade;
  const total = user.settings.total_grade / 10;
  const pred = user.settings.predicted_grade;

  switch (viewType) {
    case 'grid':
      return <GridGrades goal={goal} total={total} pred={pred} />;
    case 'graph':
      return <GraphGrades goal={goal} total={total} pred={pred} />;
    default:
      throw new Error('Invalid view type');
  }
};

interface Props {
  goal: number;
  total: number;
  pred: number;
}

const GridGrades: FC<Props> = ({ goal, total, pred }): ReactElement => {
  const happy = <SmileTwoTone size={10} twoToneColor='rgb(0, 185, 120)' />;
  const meh = <MehTwoTone size={10} twoToneColor='rgb(245, 226, 54)' />;
  const unhappy = <FrownTwoTone size={10} twoToneColor={'rgb(255, 110, 90)'} />;
  return (
    <Space className='justify-center h-full w-full' size='large'>
      <div className='text-center'>
        <p>Goal</p>
        <h2 className='text-lg font-semibold'>
          <Space>
            {goal >= 7 ?
              happy
            : goal >= 5.5 ?
              meh
            : unhappy}
            {goal}
          </Space>
        </h2>
      </div>
      <div className='text-center'>
        <p>Current</p>
        <h2 className='text-lg font-semibold'>
          <Space>
            {total > goal ?
              happy
            : total >= 5.5 ?
              meh
            : unhappy}
            {total.toFixed(1)}
          </Space>
        </h2>
      </div>
      <div className='text-center'>
        <p>Predicted</p>
        <h2 className='text-lg font-semibold'>
          <Space>
            {pred > goal ?
              happy
            : pred >= 5.5 ?
              meh
            : unhappy}
            {pred}
          </Space>
        </h2>
      </div>
    </Space>
  );
};

const GraphGrades: FC<Props> = ({ goal, total: avg, pred }): ReactElement => {
  const config: BarConfig = {
    data: [
      { name: 'Current grade', grade: avg },
      { name: 'Predicted grade', grade: pred },
    ],
    xField: 'name',
    yField: 'grade',
    colorField: 'name',
    height: 70,
    legend: false,
    scale: {
      y: { domainMax: 10 },
    },
    axis: {
      y: {
        label: false,
        tick: false,
      },
    },
    tooltip: {
      title: 0,
      items: [{ channel: 'y', valueFormatter: '.1f' }],
    },
    annotations: [
      {
        type: 'lineY',
        data: [goal],
        style: {
          stroke: 'black',
          strokeOpacity: 1,
          lineWidth: 1,
          lineDash: [8, 3],
        },
        label: {
          position: 'top',
          dy: -17,
          text: 'goal',
        },
      },
    ],
  };
  return (
    <div className='w-full h-full'>
      <Bar {...config} />
    </div>
  );
};

export default GradeDisplay;
