import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from 'next-themes';
import { type TooltipProps } from '@/types/reactRecharts';
import { printGrade, type Grades } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

const GraphGrade: FC<Grades> = ({ grade, peerAvg, peerMin, peerMax, max, type }): ReactElement => {
  const BarTooltip: FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 1) {
      const data = payload[1].payload;
      return (
        <div className='z-50 rounded-lg border border-solid border-text bg-surface1/85 p-2'>
          <div>
            {data.name === 'You' ?
              <p>
                <div className='inline-block bg-primary w-3 h-3' /> Grade: {printGrade(type, Number(data.grade), max)}
              </p>
            : <>
                <div className='inline-block w-3 h-3' style={{ backgroundColor: '#eee' }}>
                  <div className='h-1/2' />
                  <div className='h-1/2 w-full bg-secondary opacity-20'></div>
                </div>{' '}
                High: {printGrade(type, Number(data.peerMax), max)}
                <br />
                <div className='inline-block bg-secondary w-3 h-3' /> Average:{' '}
                {printGrade(type, Number(data.grade), max)}
                <br />
                <div className='inline-block w-3 h-3' style={{ backgroundColor: '#eee' }}>
                  <div className='h-1/2 w-full bg-secondary opacity-20'></div>
                </div>{' '}
                Low: {printGrade(type, Number(data.peerMin), max)}
              </>
            }
          </div>
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
          grade,
          peerMin: 0,
          peerMax: 0,
          fill: fullConfig.theme.colors.primary,
        },
        {
          name: 'Peers',
          grade: peerAvg,
          peerMin,
          peerMax,
          fill: fullConfig.theme.colors.secondary,
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
      <YAxis type='number' dataKey='grade' domain={[0, 100]} hide />
      <Tooltip content={<BarTooltip />} cursor={false} />
      <Bar
        background={{ fill: '#eee' }}
        barSize={70}
        className='[&>g>path]:!fill-overlay0'
        dataKey={({ peerMin, peerMax }) => [peerMin, peerMax]}
        opacity={0.2}
        xAxisId={0}
      />
      <Bar barSize={50} dataKey='grade' xAxisId={1} />
    </BarChart>
  );
};

export default GraphGrade;
