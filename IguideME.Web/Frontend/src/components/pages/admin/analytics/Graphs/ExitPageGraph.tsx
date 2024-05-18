import { ActionTypes } from '@/utils/analytics';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useMemo } from 'react';
import { Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SessionData } from '../analytics';

type ExitPageGraphProps = {
  sessions: Map<string, SessionData[]>;
};

const ExitPageGraph: FC<ExitPageGraphProps> = memo(({ sessions }) => {
  const exitPages: { [key: string]: number } = useMemo(() => {
    const exitPages: { [key: string]: number } = {};
    sessions.forEach((sessionDataArray, _) => {
      // Sort the array by timestamp
      sessionDataArray.sort((a, b) => a.timestamp - b.timestamp);

      // Find the last action that is either of type page or tile
      const exitPage = sessionDataArray
        .filter((data) => data.action === ActionTypes.page || data.action === ActionTypes.tile)
        .pop();

      if (exitPage) {
        if (exitPage.action === ActionTypes.tile) {
          // Remove 'opened ' from the action_detail and set the remaining string as the action
          exitPage.action_detail = exitPage.action_detail.replace('opened ', '');
        } else if (exitPage.action === ActionTypes.page) {
          // Remove 'visited page ' from the action_detail and set the remaining string as the action
          exitPage.action_detail = exitPage.action_detail.replace('visited page ', '');
        }

        if (exitPages[exitPage.action_detail] !== undefined) {
          exitPages[exitPage.action_detail]++;
        } else {
          exitPages[exitPage.action_detail] = 1;
        }
      }
    });

    return exitPages;
  }, [sessions]);

  const data = useMemo(() => {
    return Object.entries(exitPages).map(([key, value]) => {
      return { name: key, value, fill: 'blue' };
    });
  }, [exitPages]);

  const tooltipInfo =
    'This graph shows the number of times a student has exited the course from a particular page or tile.';

  return (
    <div
      className='grid h-[400px] w-[400px] grid-rows-2 rounded-md bg-card-foreground p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>Exit Page Analysis</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <XAxis axisLine dataKey='name' type='category' tick={false} />
            <YAxis axisLine type='number'>
              <Label value='Number of Exits' position='insideStart' angle={-90} dx={-10} />
            </YAxis>
            <Bar dataKey='value' />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
ExitPageGraph.displayName = 'ExitPageGraph';
export default ExitPageGraph;
