import { AnalyticsChip } from './AnalyticsBlockVariants';
import { ChipAreaGraph, ConsentGraph } from '../blocks';
import { type FC, type HTMLAttributes, memo, type ReactElement, useMemo } from 'react';
import { ActionTypes, type EventReturnType } from '@/utils/analytics';
import { type SessionData } from '../analytics';

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
  const { conversionRateData, retentionRateData, sessionData, sessionLengthData } = useMemo(() => {
    const visitData = new Map<
      string,
      { bounceCount: number; sessionCount: number; sessionLengths: number[]; returningUsers: number }
    >();

    if (sessions.size === 0) {
      return { conversionRateData: [], retentionRateData: [], sessionData: [], sessionLengthData: [] };
    }

    const seenUsers = new Set<string>();
    const seenUsersPerWeek = new Map<string, Set<string>>();
    Array.from(sessions.values()).forEach((sessionEvents) => {
      const sortedSessionEvents = sessionEvents.sort((a, b) => a.timestamp - b.timestamp);

      const firstEvent = sortedSessionEvents[0];
      const lastEvent = sortedSessionEvents[sessionEvents.length - 1];

      const eventDate = new Date(firstEvent.timestamp * 1000);
      const startOfWeek = new Date(eventDate.getTime());
      const dayOfWeek = eventDate.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toISOString();

      const currentData = visitData.get(weekKey) ?? {
        bounceCount: 0,
        sessionCount: 0,
        sessionLengths: [],
        returningUsers: 0,
      };

      // A session is considered a bounce if it never clicked on a tile
      const clickedTile = sessionEvents.some((event) => event.action === ActionTypes.tile);
      if (!clickedTile) currentData.bounceCount += 1;

      const sessionLength = (lastEvent.timestamp - firstEvent.timestamp) / 1000 / 60;
      currentData.sessionLengths.push(sessionLength);
      currentData.sessionCount += 1;

      if (!seenUsers.has(firstEvent.user_id)) {
        seenUsers.add(firstEvent.user_id);
      } else {
        if (!seenUsersPerWeek.has(weekKey)) {
          seenUsersPerWeek.set(weekKey, new Set<string>());
        }

        if (!seenUsersPerWeek.get(weekKey)?.has(firstEvent.user_id)) {
          seenUsersPerWeek.get(weekKey)?.add(firstEvent.user_id);
          currentData.returningUsers += 1;
        }
      }

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

    const retentionRateData = sortedWeekKeys
      .map((weekKey) => {
        const data = visitData.get(weekKey);
        const retentionRate = data ? data.returningUsers / seenUsers.size : 0;
        return {
          name: weekKey,
          value: retentionRate,
        };
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    const sessionData = sortedWeekKeys
      .map((weekKey) => {
        const data = visitData.get(weekKey);
        return {
          name: weekKey,
          value: data ? data.sessionCount : 0,
        };
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    const sessionLengthData = sortedWeekKeys
      .map((weekKey) => {
        const data = visitData.get(weekKey);
        if (!data || data.sessionLengths.length === 0) {
          return {
            name: weekKey,
            value: 0,
          };
        }

        const totalSessionLength = data.sessionLengths.reduce((acc, curr) => acc + curr, 0);

        return {
          name: weekKey,
          value: totalSessionLength / data.sessionLengths.length,
        };
      })
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return {
      /** conversionRateData holds the analytic data for the conversion rate per week.
       * The conversion rate measures the percentage of users who visit the site and then perform any action. */
      conversionRateData,
      /** retentionRateData holds the analytic data for the retention rate per week.
       * The retention rate measures the percentage of users who return to the site after their first visit. */
      retentionRateData,
      /** sessionData holds the analytic data for the total number of visits per week. */
      sessionData,
      /** sessionLengthData holds the analytic data for the average session length per week. */
      sessionLengthData,
    };
  }, [analytics, sessions]);

  return (
    <div className='flex w-full max-w-[2000px] flex-wrap justify-center gap-4'>
      <AnalyticsChip
        change={
          sessionData.length > 1 ?
            sessionData[sessionData.length - 1].value - sessionData[sessionData.length - 2].value
          : 0
        }
        display={sessionData.length > 0 ? sessionData[sessionData.length - 1].value : undefined}
        title='Total Visits'
        tooltip={<p className='text-xs text-white'>Total number of visits to IguideME per week.</p>}
        unit='number'
      >
        <ChipAreaGraph graphData={sessionData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={consentInfo ? consentInfo.current_consent - consentInfo.prev_consent : 0}
        display={consentInfo?.current_consent}
        title='Consent'
        tooltip={<p className='text-xs text-white'>Total number of users who have given consent to IguideME.</p>}
        unit='number'
      >
        <ConsentGraph consentInfo={consentInfo} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          conversionRateData.length > 1 ?
            Number(
              (
                (conversionRateData[conversionRateData.length - 1]?.value -
                  conversionRateData[conversionRateData.length - 2]?.value) *
                100
              ).toFixed(2),
            )
          : 0.0
        }
        display={
          conversionRateData.length > 0 ?
            (conversionRateData[conversionRateData.length - 1]?.value * 100).toFixed(2) + '%'
          : undefined
        }
        title='Conversion Rate'
        tooltip={
          <p className='text-xs text-white'>Percentage of users who visit the site and then click on any tile.</p>
        }
        unit='percentage'
      >
        <ChipAreaGraph graphData={conversionRateData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          retentionRateData.length > 1 ?
            Number(
              (
                (retentionRateData[retentionRateData.length - 1]?.value -
                  retentionRateData[retentionRateData.length - 2]?.value) *
                100
              ).toFixed(2),
            )
          : 0.0
        }
        display={
          retentionRateData.length > 0 ?
            (retentionRateData[retentionRateData.length - 1]?.value * 100).toFixed(2) + '%'
          : undefined
        }
        title='Retention Rate'
        tooltip={
          <p className='text-xs text-white'>Percentage of users who return to IguideME after their first visit.</p>
        }
        unit='percentage'
      >
        <ChipAreaGraph graphData={retentionRateData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          sessionLengthData.length > 1 ?
            Number(
              (
                sessionLengthData[sessionLengthData.length - 1]?.value -
                sessionLengthData[sessionLengthData.length - 2]?.value
              ).toFixed(0),
            )
          : 0
        }
        className='flex-grow'
        display={
          sessionLengthData.length > 0 ?
            `${Math.round(sessionLengthData[sessionLengthData.length - 1]?.value)} min`
          : undefined
        }
        title='Session Length'
        tooltip={<p className='text-xs text-white'>Average session length in minutes per week.</p>}
        unit='number'
      >
        <ChipAreaGraph graphData={sessionLengthData} />
      </AnalyticsChip>
    </div>
  );
});
AnalyticsChips.displayName = 'AnalyticsChips';
export default AnalyticsChips;
