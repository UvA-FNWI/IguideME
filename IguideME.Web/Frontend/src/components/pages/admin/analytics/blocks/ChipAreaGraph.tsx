import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { type FC, memo, type ReactElement } from 'react';

interface ChipAreaGraphProps {
  graphData: Array<{
    name: string;
    value: number;
  }>;
}

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
      </AreaChart>
    </ResponsiveContainer>
  );
});
ChipAreaGraph.displayName = 'ChipAreaGraph';
export default ChipAreaGraph;
