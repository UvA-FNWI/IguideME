import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import AnalyticsChips from './components/AnalyticsChips';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { AnalyticsGraph, AnalyticsTextBlock } from './components/AnalyticsBlockVariants';
import { getSelf } from '@/api/users';
import { PageExits, PageVisits, SunburstGraph } from './blocks';
import { useQuery } from '@tanstack/react-query';
import { ActionTypes, Analytics, type EventReturnType } from '@/utils/analytics';
import { useMemo, type FC, type ReactElement } from 'react';

export type SessionData = Omit<EventReturnType, 'user_id' | 'session_id' | 'course_id'>;

const GradeAnalytics: FC = (): ReactElement => {
  const {
    data: self,
    isError: selfIsError,
    isLoading: selfIsLoading,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  const {
    data: analytics,
    isError: analyticsIsError,
    isLoading: analyticsIsLoading,
  } = useQuery({
    queryKey: ['analytics', self!.course_id],
    queryFn: () => Analytics.getAllEvents({ courseID: self!.course_id }),
    enabled: self !== undefined,
  });

  const {
    data: consentInfo,
    isError: consentInfoIsError,
    isLoading: consentInfoIsLoading,
  } = useQuery({
    queryKey: ['analytics', 'consent', self!.course_id],
    queryFn: () => Analytics.getConsentInfo({ courseID: self!.course_id }),
    enabled: self !== undefined,
  });

  const sessions: Map<string, SessionData[]> = useMemo(() => {
    const sessionData = new Map<string, SessionData[]>();
    if (!analytics) return sessionData;

    analytics.forEach((event) => {
      const { user_id, session_id, course_id, ...rest } = event;
      const sessionID = `${user_id}-${session_id}`;

      if (sessionData.has(sessionID)) {
        const existingData = sessionData.get(sessionID);
        if (existingData) sessionData.set(sessionID, [...existingData, rest]);
      } else {
        sessionData.set(sessionID, [rest]);
      }
    });

    return sessionData;
  }, [analytics]);

  const actionDetailLength: Map<string, number> = useMemo(() => {
    const actionDetailLength = new Map<string, any>();
    if (!analytics) return actionDetailLength;

    analytics.forEach((startingEvent) => {
      if (startingEvent.action !== ActionTypes.page && startingEvent.action !== ActionTypes.tile) return;

      const actionDetail = startingEvent.action_detail;
      const currentData = actionDetailLength.get(actionDetail) ?? { totalTime: 0, count: 0 };

      const sessionEvents = sessions.get(`${startingEvent.user_id}-${startingEvent.session_id}`);
      if (!sessionEvents) return;

      const sortedSessionEvents = sessionEvents.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      // Get the event that happened after `startingEvent`. If that event doesn't exist, then the session ended.
      const startingEventIndex = sortedSessionEvents.findIndex((event) => event.timestamp === startingEvent.timestamp);
      if (startingEventIndex === -1) return;
      if (typeof sortedSessionEvents[startingEventIndex + 1] === 'undefined') return;
      const endingEvent = sortedSessionEvents[startingEventIndex + 1];

      currentData.totalTime += new Date(endingEvent.timestamp).getTime() - new Date(startingEvent.timestamp).getTime();
      currentData.count += 1;

      actionDetailLength.set(actionDetail, currentData);
    });

    // For every key in the map, calculate the average time spent on that page in minutes
    actionDetailLength.forEach((value, key) => {
      actionDetailLength.set(key, value.totalTime / 60000 / value.count);
    });

    return actionDetailLength;
  }, [sessions]);

  if (selfIsError || analyticsIsError || consentInfoIsError) {
    return (
      <div className='relative h-96 w-96 rounded-xl bg-surface1'>
        <QueryError title='Failed to usage analytic data' />
      </div>
    );
  }

  return (
    <>
      <AdminTitle title='Usage Analytics' description='View the usage analytics for your course.' />
      <QueryLoading isLoading={selfIsLoading || analyticsIsLoading || consentInfoIsLoading}>
        <div className='flex max-w-[1400px] flex-col gap-4'>
          <AnalyticsChips analytics={analytics} consentInfo={consentInfo} sessions={sessions} />
          <div className='flex flex-wrap gap-4'>
            <AnalyticsGraph
              className='w-[400px]'
              title='User Navigation Path Analysis'
              tooltip={
                <p className='text-xs text-white'>
                  This graph shows the user navigation path analysis. The root node is the number of sessions opened.
                  The children nodes are the actions taken by the user.
                </p>
              }
            >
              <SunburstGraph sessions={sessions} />
            </AnalyticsGraph>
            <AnalyticsTextBlock className='w-[560px]' title='Page Visits'>
              <PageVisits actionDetailLength={actionDetailLength} analytics={analytics} />
            </AnalyticsTextBlock>
            <AnalyticsTextBlock className='w-[400px]' title='Exit Page Analysis'>
              <PageExits sessions={sessions} />
            </AnalyticsTextBlock>
          </div>
        </div>
      </QueryLoading>
    </>
  );
};

export default GradeAnalytics;
