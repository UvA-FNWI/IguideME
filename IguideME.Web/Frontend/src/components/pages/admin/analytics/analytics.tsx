import { getSelf } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { Analytics, EventReturnType } from '@/utils/analytics';
import { useQuery } from '@tanstack/react-query';
import { useMemo, type FC, type ReactElement } from 'react';
import {
  ConsentGraph,
  ExitPageGraph,
  SessionDistributionGraph,
  SunburstGraph,
  TileVisitsGraph,
  UserAcquisitionAttritionGraph,
  UserAcquisitionGraph,
} from './Graphs';

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
    const sessionData: Map<string, SessionData[]> = new Map();
    if (!analytics) return sessionData;

    analytics.forEach((event) => {
      const { user_id, session_id, course_id, ...rest } = event;
      const sessionID = `${user_id}-${session_id}`;

      if (sessionData.has(sessionID)) {
        sessionData.set(sessionID, [...sessionData.get(sessionID)!, rest]);
      } else {
        sessionData.set(sessionID, [rest]);
      }
    });

    return sessionData;
  }, [analytics]);

  return (
    <QueryLoading isLoading={selfIsLoading || analyticsIsLoading || consentInfoIsLoading}>
      <div
        className='grid h-full w-full gap-4 rounded-md bg-card-background p-4'
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', justifyItems: 'center' }}
      >
        {selfIsError || analyticsIsError || consentInfoIsError ?
          <QueryError title='Failed to fetch analytics data' />
        : <>
            {/* How many users have given consent. It shows how many students
                are willing to participate in IguideMe. */}
            <ConsentGraph consentInfo={consentInfo} />
            {/* Shows the amount of returning users compared to new users. */}
            <UserAcquisitionGraph sessions={sessions} />
            {/* Shows the dates at which users first and last visited the website. */}
            <UserAcquisitionAttritionGraph analytics={analytics} />
            {/* Shows bounce rate, engagement rate, conversion rate and average
                session length. */}
            <SessionDistributionGraph sessions={sessions} />
            {/* Shows how tiles are visited compared to each other. */}
            <TileVisitsGraph analytics={analytics} />
            {/* Shows on which page users exit the website. */}
            <ExitPageGraph sessions={sessions} />
            {/* Shows the navigation path analysis. */}
            <SunburstGraph sessions={sessions} />
          </>
        }
      </div>
    </QueryLoading>
  );
};

export default GradeAnalytics;
