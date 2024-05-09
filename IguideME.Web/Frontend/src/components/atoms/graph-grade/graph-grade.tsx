import tailwindConfig from '@/../tailwind.config.js';
import { TooltipProps } from '@/types/reactRecharts';
import { printGrade, type Grades } from '@/types/tile';
import { useTheme } from 'next-themes';
import { type FC, type ReactElement } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import resolveConfig from 'tailwindcss/resolveConfig';

const GraphGrade: FC<Grades> = ({ grade, peerAvg, peerMin, peerMax, max, type }): ReactElement => {
  const BarTooltip: FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='z-50 rounded-lg border border-solid border-text bg-body p-2'>
          <p>
            {payload[0].payload.name === 'Peers' ? 'Average ' : ''}Grade: {printGrade(type, payload[0].value, max)}
            {payload[0].payload.name === 'Peers' ?
              <>
                <br />
                {`Min - Max: (${Number(payload[0].payload.peerMin).toFixed(1)}-${Number(payload[0].payload.peerMax).toFixed(1)})`}
              </>
            : ''}
          </p>
        </div>
      );
    }
  };

  const fullConfig = resolveConfig(tailwindConfig);
  const { theme } = useTheme();
  return (
    <BarChart
      barGap={-30}
      data={[
        {
          name: 'You',
          grade: grade,
          peerMin: 0,
          peerMax: 0,
          fill: fullConfig.theme.colors.graph.you,
        },
        {
          name: 'Peers',
          grade: peerAvg,
          peerMin: peerMin,
          peerMax: peerMax,
          fill: fullConfig.theme.colors.graph.peer,
        },
      ]}
      margin={{
        top: 10,
        right: 20,
        left: 20,
        bottom: 10,
      }}
      width={250}
      height={180}
    >
      <XAxis dataKey='name' xAxisId={0} stroke={theme === 'light' ? 'black' : 'white'} />
      <XAxis dataKey='name' xAxisId={1} hide />
      <YAxis dataKey='grade' domain={[0, max]} hide />
      {/* @ts-ignore */}
      <Tooltip content={<BarTooltip />} />
      <Bar
        background={{ fill: '#eee' }}
        barSize={70}
        className='[&>g>path]:!fill-graph-max'
        dataKey={({ peerMin, peerMax }) => [peerMin, peerMax]}
        opacity={0.5}
        xAxisId={0}
      />
      <Bar barSize={50} dataKey='grade' xAxisId={1} />
    </BarChart>
  );
};

export default GraphGrade;
