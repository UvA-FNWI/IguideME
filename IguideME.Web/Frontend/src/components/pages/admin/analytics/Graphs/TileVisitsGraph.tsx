import { ActionTypes, EventReturnType } from '@/utils/analytics';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

type TileVisitsGraphProps = {
  analytics?: EventReturnType[];
};

const TileVisitsGraph: FC<TileVisitsGraphProps> = memo(({ analytics }) => {
  const tileVisits: { [key: string]: number } = useMemo(() => {
    const tileVisits: { [key: string]: number } = {};
    analytics?.forEach((event) => {
      if (event.action === ActionTypes.tile) {
        if (tileVisits[event.action_detail]) {
          tileVisits[event.action_detail]++;
        } else {
          tileVisits[event.action_detail] = 1;
        }
      }
    });

    return tileVisits;
  }, [analytics]);

  const tileVisitsData = Object.entries(tileVisits).map(([key, value]) => ({
    key_title: key.replace('opened ', ''),
    value,
  }));

  const tooltipInfo = 'This graph shows the number of times a student has visited a particular tile.';

  return (
    <div
      className='grid h-[400px] w-[400px] grid-rows-2 overflow-hidden rounded-md bg-card-foreground p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>What tiles are visited most?</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-[350px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart cx='50%' cy='50%' outerRadius='60%' data={tileVisitsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey='key_title' tick={{ fontSize: '10px' }} />
            <PolarRadiusAxis />
            <Radar name='Mike' dataKey='value' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
TileVisitsGraph.displayName = 'TileVisitsGraph';
export default TileVisitsGraph;
