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
  /** sessionData holds the analytic data for the number of sessions per week */
  const sessionData = useMemo(() => {
    const sessionsByWeek = new Map<string, number>();
    if (!analytics) return [];

    const sortedAnalytics = analytics.sort((a, b) => a.session_id - b.session_id);

    let previousSessionID: number = -1;
    sortedAnalytics.forEach((event) => {
      const eventDate = new Date(event.timestamp * 1000);
      const startOfWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay() + 1,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toISOString();

      if (previousSessionID === event.session_id) return;

      const currentCount = sessionsByWeek.get(weekKey) ?? 0;
      sessionsByWeek.set(weekKey, currentCount + 1);
      previousSessionID = event.session_id;
    });

    // If no data, return the current week with a value of 0
    if (sessionsByWeek.size === 0) {
      const currentWeek = new Date();
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
      currentWeek.setHours(0, 0, 0, 0);
      return [{ name: currentWeek.toISOString(), value: 0 }];
    }

    // Fill in the gaps with 0 values
    const sortedWeekKeys = Array.from(sessionsByWeek.keys()).sort();
    const startWeek = new Date(sortedWeekKeys[0]);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 1);
    thisWeek.setHours(0, 0, 0, 0);

    const allWeeks = [];
    // eslint-disable-next-line no-unmodified-loop-condition -- loop is modified with date.setDate()
    for (let week = new Date(startWeek); week <= thisWeek; week.setDate(week.getDate() + 7)) {
      const weekKey = week.toISOString();
      allWeeks.push({
        name: weekKey,
        value: sessionsByWeek.get(weekKey) ?? 0,
      });
    }

    return allWeeks;
  }, [analytics]);

  const { conversionRateData } = useMemo(() => {
    const visitData = new Map<string, { bounceCount: number; sessionCount: number; sessionLengths: number[] }>();
    if (sessions.size === 0) return { conversionRateData: [], sessionLengthData: [] };

    Array.from(sessions.values()).forEach((sessionEvents) => {
      const sortedSessionEvents = sessionEvents.sort((a, b) => a.timestamp - b.timestamp);

      const firstEvent = sortedSessionEvents[0];
      const lastEvent = sortedSessionEvents[sessionEvents.length - 1];

      const eventDate = new Date(firstEvent.timestamp * 1000);
      const startOfWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay() + 1,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toISOString();

      const currentData = visitData.get(weekKey) ?? { bounceCount: 0, sessionCount: 0, sessionLengths: [] };

      // A session is considered a bounce if it never clicked on a tile
      const clickedTile = sessionEvents.some((event) => event.action === ActionTypes.tile);
      if (!clickedTile) currentData.bounceCount += 1;

      const sessionLength = (lastEvent.timestamp - firstEvent.timestamp) / 60;
      currentData.sessionLengths.push(sessionLength);
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
            sessionData[sessionData.length - 1].value - sessionData[sessionData.length - 2].value
          : 0
        }
        display={sessionData.length > 0 ? sessionData[sessionData.length - 1].value : undefined}
        title='Total Visits'
        unit='number'
      >
        <ChipAreaGraph graphData={sessionData} />
      </AnalyticsChip>

      <AnalyticsChip
        change={
          conversionRateData.length > 1 ?
            Math.round(
              conversionRateData[conversionRateData.length - 1]?.value -
                conversionRateData[conversionRateData.length - 2]?.value,
            )
          : 0
        }
        display={
          conversionRateData.length > 0 ?
            (conversionRateData[conversionRateData.length - 1]?.value * 100).toFixed(2) + '%'
          : undefined
        }
        title='Conversion Rate'
        unit='percentage'
      >
        <ChipAreaGraph graphData={conversionRateData} />
      </AnalyticsChip>

      {/* <AnalyticsChip
        change={
          sessionLengthData.length > 1 ?
            Math.round(
              sessionLengthData[sessionLengthData.length - 1]?.value -
                sessionLengthData[sessionLengthData.length - 2]?.value,
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
        unit='number'
      >
        <ChipAreaGraph graphData={sessionLengthData} />
      </AnalyticsChip> */}
    </div>
  );
});
AnalyticsChips.displayName = 'AnalyticsChips';
export default AnalyticsChips;
