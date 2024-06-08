import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import { Bar, BarChart, Label, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FrownTwoTone, MehTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import { type TooltipProps } from '@/types/reactRecharts';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { memo, type FC, type ReactElement } from 'react';

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
    <Space className='h-full w-full justify-center' size='large'>
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

const BarTooltip: FC<TooltipProps> = memo(({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className='z-50 rounded-lg border border-solid border-text bg-crust/80 p-2'>
        <p>
          {label}: {Number(payload[0].value.toFixed(1))}/10
        </p>
      </div>
    );
  }
});
BarTooltip.displayName = 'BarTooltip';

const GraphGrades: FC<Props> = memo(({ goal, total, pred }): ReactElement => {
  const fullConfig = resolveConfig(tailwindConfig);

  return (
    <ResponsiveContainer width='100%' minWidth={330} height={40}>
      <BarChart
        data={[
          {
            name: 'Current Grade',
            grade: total,
            fill: fullConfig.theme.colors.primary,
          },
          {
            name: 'Predicted Grade',
            grade: pred,
            fill: fullConfig.theme.colors.tertiary,
          },
        ]}
        height={40}
        layout='vertical'
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        width={400}
      >
        <XAxis hide axisLine={false} type='number' domain={[0, 10]} />
        <YAxis axisLine dataKey='name' tick={false} tickSize={0} type='category' width={1} />
        <Tooltip content={<BarTooltip />} cursor={false} />
        <Bar dataKey='grade' className='[&>g>path]:!fill-overlay0' barSize={15} background={{ fill: '#eee' }} />
        <ReferenceLine className='stroke-text [&>line]:!stroke-text' strokeDasharray='3 3' strokeWidth={2} x={goal}>
          <Label value='goal' position='insideLeft' />
        </ReferenceLine>
      </BarChart>
    </ResponsiveContainer>
  );
});
GraphGrades.displayName = 'GraphGrades';
export default GradeDisplay;
