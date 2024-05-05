import { FrownTwoTone, MehTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import { useTheme } from 'next-themes';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { memo, type FC, type ReactElement } from 'react';

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

const GridGrades: FC<Props> = memo(({ goal, total, pred }): ReactElement => {
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
            {total}
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
});
GridGrades.displayName = 'GridGrades';

const GraphGrades: FC<Props> = memo(({ goal, total, pred }): ReactElement => {
  const { theme } = useTheme();
  const config: BarConfig = {
    data: [
      { name: 'Current grade', grade: total },
      { name: 'Predicted grade', grade: pred },
    ],
    xField: 'name',
    yField: 'grade',
    style: {
      fill: ({ name }: { name: 'Current grade' | 'Predicted grade' }) => {
        if (name === 'Current grade') return '#5a32ff';
        else return theme === 'dark' ? '#c4a4ff' : '#0dcccc';
      },
    },
    height: 70,
    legend: false,
    scale: {
      y: { domainMax: 10 },
    },
    axis: {
      x: {
        labelFill: theme === 'light' ? 'black' : 'white',
      },
      y: {
        label: false,
        tick: false,
      },
    },
    tooltip: {
      items: [{ channel: 'y', valueFormatter: '.1f' }],
    },
    annotations: [
      {
        type: 'lineY',
        data: [goal],
        style: {
          stroke: theme === 'light' ? 'black' : 'white',
          strokeOpacity: 1,
          lineWidth: 1,
          lineDash: [8, 3],
        },
        label: {
          fill: theme === 'light' ? 'black' : 'white',
          position: 'top',
          dy: -17,
          text: 'goal',
        },
      },
    ],
    optimization: {
      sideEffects: true,
    },
  };
  return (
    <div className='w-full h-full'>
      <Bar {...config} />
    </div>
  );
});
GraphGrades.displayName = 'GraphGrades';
export default GradeDisplay;
