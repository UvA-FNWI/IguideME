import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useMemo } from 'react';
import { Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SessionData } from '../analytics';

type UserAcquisitionGraphProps = {
  sessions: Map<string, SessionData[]>;
};

const UserAcquisitionGraph: FC<UserAcquisitionGraphProps> = memo(({ sessions }) => {
  type Data = {
    newUsers: number;
    returningUsers: number;
  };

  const data: Data = useMemo(() => {
    const seenUsersSet: Set<string> = new Set();
    const returningUsersSet: Set<string> = new Set();

    let newUsers = 0;
    let returningUsers = 0;

    for (const key of sessions.keys()) {
      const [userID] = key.split('-');
      if (returningUsersSet.has(userID)) continue;

      if (seenUsersSet.has(userID)) {
        newUsers--;
        returningUsers++;
        returningUsersSet.add(userID);
      } else {
        seenUsersSet.add(userID);
        newUsers++;
      }
    }

    return { newUsers, returningUsers };
  }, [sessions]);

  const tooltipInfo = (
    <p className='text-sm text-white'>
      This graph shows the number of new users and returning users.
      <br />
      <br />
      New user are students who have visited IguideME for the first time.
      <br />
      <br />
      Returning users are students who have visited IguideME before.
    </p>
  );

  return (
    <div
      className='grid h-[400px] w-[400px] grid-rows-2 rounded-md bg-card-foreground p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>User Acquisition Breakdown</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={[
              { name: 'New Users', value: data.newUsers, fill: 'red' },
              { name: 'Returning Users', value: data.returningUsers, fill: 'blue' },
            ]}
          >
            <XAxis axisLine dataKey='name' type='category' />
            <YAxis axisLine domain={[0, data.newUsers + data.returningUsers]} type='number'>
              <Label value='Number of Students' position='insideStart' angle={-90} dx={-10} />
            </YAxis>
            <Bar dataKey='value' background={{ fill: '#636363' }} />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
UserAcquisitionGraph.displayName = 'UserAcquisitionGraph';
export default UserAcquisitionGraph;
