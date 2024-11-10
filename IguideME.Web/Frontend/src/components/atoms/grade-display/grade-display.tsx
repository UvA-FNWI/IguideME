import tailwindConfig from '@/../tailwind.config';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { UseMediaQuery } from '@/hooks/UseMediaQuery';
import { varFixed } from '@/types/grades';
import { type TooltipProps } from '@/types/reactRecharts';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import { memo, type FC, type ReactElement } from 'react';
import { Bar, BarChart, Label, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import resolveConfig from 'tailwindcss/resolveConfig';

const GradeDisplay: FC = (): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

  if (user.settings === undefined) {
    return <Spin spinning />;
  }

  const goal = user.settings.goal_grade;
  const total = user.settings.total_grade;
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
  const happy = <SmileOutlined className='text-success' />;
  const meh = <MehOutlined className='text-meh' />;
  const neutral = <MehOutlined className='text-text/40' />;
  const unhappy = <FrownOutlined className='text-failure' />;

  return (
    <div className='flex w-full items-center justify-center gap-6'>
      <div className='text-center'>
        <p>Goal</p>
        <h2 className='text-lg font-semibold'>
          <Space>
            {goal >= 7 ?
              happy
            : goal >= 5.5 ?
              meh
            : unhappy}
            {varFixed(goal)}
          </Space>
        </h2>
      </div>
      <div className='text-center'>
        <p>Current</p>
        <h2 className='text-lg font-semibold'>
          <Space>
            {total >= goal ?
              happy
            : total >= 5.5 ?
              meh
            : total > 0 ?
              unhappy
            : neutral}
            {varFixed(total)}
          </Space>
        </h2>
      </div>
      {pred > 0 && (
        <div className='text-center'>
          <p>Predicted</p>
          <h2 className='text-lg font-semibold'>
            <Space>
              {pred >= goal ?
                happy
              : pred >= 5.5 ?
                meh
              : unhappy}
              {varFixed(pred)}
            </Space>
          </h2>
        </div>
      )}
    </div>
  );
});
GridGrades.displayName = 'GridGrades';

const BarTooltip: FC<TooltipProps> = memo(({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className='border-text bg-crust/80 z-50 rounded-lg border border-solid p-2'>
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
  const isMobile = UseMediaQuery('(max-width: 767px)');
  const isTablet = UseMediaQuery('(max-width: 1023px)');

  const data = [
    {
      name: 'Current Grade',
      grade: total,
      fill: fullConfig.theme.colors.primary,
    },
  ];

  if (pred > 0) {
    data.push({
      name: 'Predicted Grade',
      grade: pred,
      fill: fullConfig.theme.colors.tertiary,
    });
  }

  return (
    <ResponsiveContainer
      width='100%'
      minWidth={
        isMobile ? 'auto'
        : isTablet ?
          '330px'
        : '400px'
      }
      height={50}
    >
      <BarChart
        data={data}
        layout='vertical'
        margin={{
          top: 20,
          right: 15,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis hide axisLine={false} type='number' domain={[0, 10]} />
        <YAxis axisLine dataKey='name' tick={false} tickSize={0} type='category' width={1} />
        <Tooltip content={<BarTooltip />} cursor={false} />
        <Bar dataKey='grade' className='[&>g>path]:!fill-overlay0' barSize={15} background={{ fill: '#eee' }}>
          <LabelList dataKey='name' position='insideLeft' fill='#ffffff' width={150} />
        </Bar>
        <ReferenceLine className='stroke-text [&>line]:!stroke-text' strokeDasharray='3 3' strokeWidth={2} x={goal}>
          <Label value='goal' position='top' />
        </ReferenceLine>
      </BarChart>
    </ResponsiveContainer>
  );
});
GraphGrades.displayName = 'GraphGrades';
export default GradeDisplay;
