import { type FC, memo, type ReactElement } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface ChipAreaGraphProps {
  graphData: {
    name: string;
    value: number;
  }[];
}

const ChipAreaGraph: FC<ChipAreaGraphProps> = memo(({ graphData }): ReactElement => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={graphData}>
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
