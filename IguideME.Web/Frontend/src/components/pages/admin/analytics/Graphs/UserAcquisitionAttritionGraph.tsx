import { EventReturnType } from '@/utils/analytics';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useMemo } from 'react';
import { Bar, BarChart, Brush, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type UserAcquisitionAttritionGraphProps = {
  analytics?: EventReturnType[];
};

const UserAcquisitionAttritionGraph: FC<UserAcquisitionAttritionGraphProps> = memo(({ analytics }) => {
  type EventsPerUserType = Omit<EventReturnType, 'user_id' | 'course_id'>;
  const eventsPerUser: Map<string, EventsPerUserType[]> = useMemo(() => {
    const userEvents: Map<string, EventsPerUserType[]> = new Map();
    if (!analytics) return userEvents;

    analytics.forEach((event) => {
      const { user_id, course_id, ...rest } = event;

      const userEvent = userEvents.get(user_id);
      if (userEvent) {
        if (rest.timestamp < userEvent[0].timestamp) userEvent[0] = rest;
        if (rest.timestamp > userEvent[1].timestamp) userEvent[1] = rest;
      } else {
        userEvents.set(user_id, [rest, rest]);
      }
    });

    return userEvents;
  }, [analytics]);

  const sessionMaps: {
    firstSession: Map<string, number>;
    lastSession: Map<string, number>;
  } = useMemo(() => {
    const firstSessionMap: Map<string, number> = new Map();
    const lastSessionMap: Map<string, number> = new Map();

    eventsPerUser.forEach((events) => {
      const [firstEvent, lastEvent] = events;
      const firstSessionDate = new Date(firstEvent.timestamp).toISOString().split('T')[0];
      const lastSessionDate = new Date(lastEvent.timestamp).toISOString().split('T')[0];

      if (firstSessionMap.has(firstSessionDate)) {
        firstSessionMap.set(firstSessionDate, firstSessionMap.get(firstSessionDate)! + 1);
      } else {
        firstSessionMap.set(firstSessionDate, 1);
      }

      if (lastSessionMap.has(lastSessionDate)) {
        lastSessionMap.set(lastSessionDate, lastSessionMap.get(lastSessionDate)! + 1);
      } else {
        lastSessionMap.set(lastSessionDate, 1);
      }
    });

    return { firstSession: firstSessionMap, lastSession: lastSessionMap };
  }, [eventsPerUser]);

  const data: {
    name: string;
    gain: number;
    loss: number;
  }[] = useMemo(() => {
    const data: { name: string; gain: number; loss: number }[] = [];
    const allDates = Array.from(
      new Set([...sessionMaps.firstSession.keys(), ...sessionMaps.lastSession.keys()]),
    ).sort();

    allDates.forEach((date) => {
      const gain = sessionMaps.firstSession.get(date) || 0;
      const loss = sessionMaps.lastSession.get(date) || 0;
      data.push({ name: date, gain, loss: -loss });
    });

    return data;
  }, [sessionMaps]);

  const tooltipInfo =
    'This graph shows the number of students that started and ended their course on a particular date.';

  return (
    <div
      className='bg-overlay0 grid h-[400px] w-[400px] grid-rows-2 rounded-md p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>User Acquisition and Attrition Rates</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} stackOffset='sign'>
            <XAxis axisLine dataKey='name' type='category' tick={false}>
              <Label value='Date' position='insideBottom' />
            </XAxis>
            <YAxis axisLine type='number'>
              <Label value='Number of Students' position='insideStart' angle={-90} dx={-10} />
            </YAxis>
            <Tooltip />
            <Brush dataKey='name' height={30} />
            <Bar dataKey='gain' fill='green' stackId='stack' />
            <Bar dataKey='loss' fill='red' stackId='stack' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
UserAcquisitionAttritionGraph.displayName = 'UserAcquisitionAttritionGraph';
export default UserAcquisitionAttritionGraph;
