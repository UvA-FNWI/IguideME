import { Area, AreaChart, ResponsiveContainer, Tooltip, type TooltipProps } from 'recharts';
import { type FC, memo, type ReactElement } from 'react';

interface ChipAreaGraphProps {
  graphData: Array<{
    name: string;
    value: number;
  }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  label?: string;
  payload?: Array<{ value: number }>;
  isSingleWeek: boolean;
}

const CustomTooltip = ({ active, label, payload, isSingleWeek }: CustomTooltipProps): ReactElement | null => {
  if (active && payload?.length) {
    const y = Number.isInteger(payload[0].value) ? payload[0].value : payload[0].value.toFixed(2);

    const weekLabel = isSingleWeek ? 'Week 1' : `Week ${Number(label) + 1}`;
    return (
      <div className='bg-surface1 p-3'>
        <p>{`${weekLabel}: ${y}`}</p>
      </div>
    );
  }

  return null;
};

const ChipAreaGraph: FC<ChipAreaGraphProps> = memo(({ graphData }): ReactElement => {
  const adjustedGraphData = graphData.length === 1 ? [...graphData, { ...graphData[0] }] : graphData;

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={adjustedGraphData}>
        <defs>
          <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#fc5f5f' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#ffffff' stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type='monotone' dataKey='value' stroke='#fc5f5f' fill='url(#colorUv)' strokeWidth={2} dot={false} />
        <Tooltip content={<CustomTooltip isSingleWeek={graphData.length === 1} />} />
      </AreaChart>
    </ResponsiveContainer>
  );
});
ChipAreaGraph.displayName = 'ChipAreaGraph';
export default ChipAreaGraph;
