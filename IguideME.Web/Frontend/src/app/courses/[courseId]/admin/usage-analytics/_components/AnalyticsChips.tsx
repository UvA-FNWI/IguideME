import { type FC, type HTMLAttributes, memo, type ReactElement, useMemo } from 'react';

import { ChipAreaGraph, ConsentGraph } from '@/app/courses/[courseId]/admin/usage-analytics/_blocks';
import type { SessionData } from '@/app/courses/[courseId]/admin/usage-analytics/page';
import type { EventReturnType } from '@/types/analytic';

import { AnalyticsChip } from './AnalyticsBlockVariants';

interface AnalyticsChipProps extends HTMLAttributes<HTMLDivElement> {
  analytics?: EventReturnType[];
  consentInfo?: {
    current_consent: number;
    prev_consent: number;
    total: number;
  };
  sessions: Map<string, SessionData[]>;
}

const AnalyticsChips: FC<AnalyticsChipProps> = memo(({ analytics, consentInfo, sessions }): ReactElement => {
  /** sessionData holds the analytic data for the number of sessions per week */
  const sessionData = useMemo(() => {
    const sessionsByWeek = new Map<string, number>();
    if (!analytics) return [];

    analytics.forEach((event) => {
      const eventDate = new Date(event.timestamp);
      const startOfWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay() + 1,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toISOString();

      const currentCount = sessionsByWeek.get(weekKey) ?? 0;
      sessionsByWeek.set(weekKey, currentCount + 1);
    });

    const sortedWeekKeys = Array.from(sessionsByWeek.keys()).sort();
    return sortedWeekKeys.map((weekKey) => ({
      name: weekKey,
      value: sessionsByWeek.get(weekKey) ?? 0,
    }));
  }, [analytics]);

  const { conversionRateData, sessionLengthData } = useMemo(() => {
    const visitData = new Map<string, { bounceCount: number; sessionCount: number; totalSessionLength: number }>();
    if (!analytics) return { conversionRateData: [], sessionLengthData: [] };

    analytics.forEach((event) => {
      const eventDate = new Date(event.timestamp);
      const startOfWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay() + 1,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toISOString();

      const currentData = visitData.get(weekKey) ?? { bounceCount: 0, sessionCount: 0, totalSessionLength: 0 };

      const sessionID = `${event.user_id}-${event.session_id}`;
      const sessionEvents = sessions.get(sessionID);
      if (!sessionEvents) return;

      if (sessionEvents.length === 1) currentData.bounceCount += 1;

      const sortedSessionEvents = sessionEvents.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      const firstEvent = sortedSessionEvents[0]!;
      const lastEvent = sortedSessionEvents[sessionEvents.length - 1]!;
      const sessionLength = new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime();
      currentData.totalSessionLength += sessionLength;

      currentData.sessionCount += 1;

      visitData.set(weekKey, currentData);
    });

    const sortedWeekKeys = Array.from(visitData.keys()).sort();

    const conversionRateData = sortedWeekKeys
      .map((weekKey) => {
        const data = visitData.get(weekKey);
        const conversionRate = data ? 1 - data.bounceCount / data.sessionCount : 0;
        return {
          name: weekKey,
          value: conversionRate,
        };
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    const sessionLengthData = sortedWeekKeys
      .map((weekKey) => {
        const data = visitData.get(weekKey);
        const averageSessionLength = data ? data.totalSessionLength / 3600 / data.sessionCount : 0;
        return {
          name: weekKey,
          value: averageSessionLength,
        };
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return {
      /** conversionRateData holds the analytic data for the conversion rate per week.
       * The conversion rate measures the percentage of users who visit the site and then perform any action. */
      conversionRateData,
      /** sessionLengthData holds the analytic data for the average session length per week. */
      sessionLengthData,
    };
  }, [analytics, sessions]);

  return (
    <div className='flex w-full max-w-[2000px] flex-wrap justify-center gap-4'>
      <AnalyticsChip
        change={consentInfo ? consentInfo.current_consent - consentInfo.prev_consent : 0}
        display={consentInfo?.current_consent}
        title='Consent'
        unit='number'
      >
        <ConsentGraph consentInfo={consentInfo} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          sessionData.length > 1 ?
            sessionData[sessionData.length - 1]!.value - sessionData[sessionData.length - 2]!.value
          : 0
        }
        display={sessionData.length > 0 ? sessionData[sessionData.length - 1]!.value : undefined}
        title='Total Visits'
        unit='number'
      >
        <ChipAreaGraph graphData={sessionData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          conversionRateData.length > 1 ?
            Math.round(
              conversionRateData[conversionRateData.length - 1]!.value -
                conversionRateData[conversionRateData.length - 2]!.value,
            )
          : 0
        }
        display={
          conversionRateData.length > 0 ?
            `${(conversionRateData[conversionRateData.length - 1]!.value * 100).toFixed(2)}%`
          : undefined
        }
        title='Conversion Rate'
        unit='percentage'
      >
        <ChipAreaGraph graphData={conversionRateData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          sessionLengthData.length > 1 ?
            Math.round(
              sessionLengthData[sessionLengthData.length - 1]!.value -
                sessionLengthData[sessionLengthData.length - 2]!.value,
            )
          : 0
        }
        className='flex-grow'
        display={
          sessionLengthData.length > 0 ?
            `${Math.round(sessionLengthData[sessionLengthData.length - 1]!.value)} min`
          : undefined
        }
        title='Session Length'
        unit='number'
      >
        <ChipAreaGraph graphData={sessionLengthData} />
      </AnalyticsChip>
    </div>
  );
});
AnalyticsChips.displayName = 'AnalyticsChips';
export default AnalyticsChips;
