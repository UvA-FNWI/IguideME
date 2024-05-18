import { ActionTypes } from '@/utils/analytics';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useMemo } from 'react';
import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { SessionData } from '../analytics';

type SessionDistributionGraphProps = {
  sessions: Map<string, SessionData[]>;
};

const SessionDistributionGraph: FC<SessionDistributionGraphProps> = memo(({ sessions }) => {
  const data: {
    /** The average session length of the sessions. */
    averageSessionLength: number;
    /** This is the percentage of sessions in which there was no interaction with the website. */
    bounceRate: number;
    /** This is the percentage of sessions in which the user interacted with a tile. */
    conversionRate: number;
  } = useMemo(() => {
    let bounceCount = 0;
    let conversionCount = 0;
    let sessionCount = 0;
    let totalSessionLength = 0;

    sessions.forEach((sessionDataArray, _) => {
      sessionCount++;

      if (sessionDataArray.length === 1) bounceCount++;
      if (sessionDataArray.some((data) => data.action === ActionTypes.tile)) conversionCount++;

      if (sessionDataArray.length > 1) {
        const timestamps = sessionDataArray.map((data) => data.timestamp);
        const sessionStart = Math.min(...timestamps);
        const sessionEnd = Math.max(...timestamps);

        totalSessionLength += sessionEnd - sessionStart;
      }
    });

    const averageSessionLength = totalSessionLength / sessionCount;
    const bounceRate = bounceCount / sessionCount;
    const conversionRate = conversionCount / sessionCount;

    return { averageSessionLength, bounceRate, conversionRate };
  }, [sessions]);

  const RadialBarChartData = [
    {
      name: 'Bounce Rate (%)',
      data: Math.round(data.bounceRate * 100),
      fill: 'red',
    },
    {
      name: 'Engagement Rate (%)',
      data: Math.round((1 - data.bounceRate - data.conversionRate) * 100),
      fill: 'blue',
    },
    {
      name: 'Conversion Rate (%)',
      data: Math.round(data.conversionRate * 100),
      fill: 'green',
    },
  ];

  const tooltipInfo = (
    <p className='text-sm text-white'>
      This graph shows the bounce rate, engagement rate, and conversion rate of the sessions.
      <br />
      <br />
      The bounce rate is the percentage of sessions in which there was no interaction with the website.
      <br />
      <br />
      The engagement rate is the percentage of sessions in which the user interacted with the website.
      <br />
      <br />
      The conversion rate is the percentage of sessions in which the user interacted with a tile.
    </p>
  );

  return (
    <div
      className='bg-overlay0 grid h-[400px] w-[400px] grid-rows-2 rounded-md p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>Average Session Length Distribution</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadialBarChart data={RadialBarChartData} innerRadius='10%' outerRadius='80%' startAngle={180} endAngle={0}>
            <RadialBar
              background={{ fill: '#636363' }}
              dataKey='data'
              label={{
                position: 'insideStart',
                fill: 'white',
              }}
            />
            <Legend layout='horizontal' verticalAlign='middle' wrapperStyle={{ top: 0, right: 0 }} />
            <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
            <text x='50%' y='60%' textAnchor='middle' dominantBaseline='middle'>
              The average session length was {Math.round(data.averageSessionLength / 60)} minutes
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
SessionDistributionGraph.displayName = 'SessionDistributionGraph';
export default SessionDistributionGraph;
