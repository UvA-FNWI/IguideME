'use client';

import { type ReactElement, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { getAllEvents, getConsentInfo } from '@/api/analytic';
import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';
import { QueryError } from '@/app/courses/[courseId]/admin/settings/_components/query-error';
import { QueryLoading } from '@/app/courses/[courseId]/admin/settings/_components/query-loading';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import { ActionTypes, type EventReturnType } from '@/types/analytic';

import { AnalyticsGraph, AnalyticsTextBlock } from './_components/AnalyticsBlockVariants';
import AnalyticsChips from './_components/AnalyticsChips';
import { PageExits, PageVisits, SunburstGraph } from './_blocks';

type SessionData = Omit<EventReturnType, 'user_id' | 'session_id' | 'course_id'>;

function GradeAnalytics(): ReactElement {
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  const {
    data: analytics,
    isError: analyticsIsError,
    isLoading: analyticsIsLoading,
  } = useQuery({
    queryKey: ['analytics', self.course_id],
    queryFn: async () => await getAllEvents({ courseID: self.course_id }),
    enabled: self !== undefined,
  });

  const {
    data: consentInfo,
    isError: consentInfoIsError,
    isLoading: consentInfoIsLoading,
  } = useQuery({
    queryKey: ['analytics', 'consent', self.course_id],
    queryFn: async () => await getConsentInfo({ courseID: self.course_id }),
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
    const adl = new Map<string, number>();
    if (!analytics) return adl;

    analytics.forEach((startingEvent) => {
      if (startingEvent.action !== ActionTypes.page && startingEvent.action !== ActionTypes.tile) return;

      const actionDetail = startingEvent.action_detail;
      const currentData = adl.get(actionDetail) ?? { totalTime: 0, count: 0 };

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

      adl.set(actionDetail, currentData);
    });

    // For every key in the map, calculate the average time spent on that page in minutes
    adl.forEach((value, key) => {
      adl.set(key, value.totalTime / 60000 / value.count);
    });

    return adl;
  }, [sessions]);

  if (analyticsIsError || consentInfoIsError) {
    return (
      <div className='bg-surface1 relative h-96 w-96 rounded-xl'>
        <QueryError title='Failed to load usage analytic data' />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title='Usage Analytics' subtitle='View the usage analytics for your course.' />
      <QueryLoading isLoading={analyticsIsLoading || consentInfoIsLoading}>
        <div className='flex w-full flex-col gap-4'>
          <AnalyticsChips analytics={analytics} consentInfo={consentInfo} sessions={sessions} />
          <div className='flex w-full max-w-[2000px] flex-wrap justify-center gap-4'>
            <AnalyticsGraph
              className='min-w-[400px] max-w-[900px] flex-1 flex-grow'
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
            <AnalyticsTextBlock className='min-w-[560px] max-w-[900px] flex-1 flex-grow' title='Page Visits'>
              <PageVisits actionDetailLength={actionDetailLength} analytics={analytics} />
            </AnalyticsTextBlock>
            <AnalyticsTextBlock className='min-w-[400px] max-w-[900px] flex-1 flex-grow' title='Exit Page Analysis'>
              <PageExits sessions={sessions} />
            </AnalyticsTextBlock>
          </div>
        </div>
      </QueryLoading>
    </>
  );
}

export type { SessionData };
export default GradeAnalytics;
