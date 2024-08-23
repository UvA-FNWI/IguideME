import type { ConsentInfoReturnType, EventReturnType, TrackEventProps } from '@/types/analytic';

import { apiClient } from './axios';

async function getAllEvents({ courseID }: { courseID: number }): Promise<EventReturnType[]> {
  const data = await apiClient.get(`api/analytic/results/${String(courseID)}`);
  return data.data as EventReturnType[];
}

async function getConsentInfo({ courseID }: { courseID: number }): Promise<ConsentInfoReturnType> {
  const data = await apiClient.get(`api/analytic/consent/${String(courseID)}`);
  return data.data as ConsentInfoReturnType;
}

async function trackEvent({ userID, action, actionDetail, courseID }: TrackEventProps): Promise<void> {
  await apiClient
    .post('api/analytic/track', {
      UserID: userID,
      Action: action,
      ActionDetail: actionDetail,
      CourseID: courseID,
    })
    .catch(() => {
      // silently fail, since this is not critical
    });
}

/**
 * Check if the given timestamp lays in the current week number.
 * @param timestamp - The timestamp to check.
 * @returns True if the timestamp is in the current week, false otherwise.
 */
function isThisWeek(timestamp: number): boolean {
  const eventDate = new Date(timestamp);
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  return eventDate >= startOfWeek;
}

export { getAllEvents, getConsentInfo, isThisWeek, trackEvent };
