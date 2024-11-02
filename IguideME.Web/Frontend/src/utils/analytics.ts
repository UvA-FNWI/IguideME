import apiClient from '@/api/axios';

enum ActionTypes {
  page,
  tile,
  tileView,
  theme,
  notifications,
  settingChange,
}

interface EventReturnType {
  timestamp: number;
  user_id: string;
  action: ActionTypes;
  action_detail: string;
  session_id: number;
  course_id: number;
}

interface TrackEventProps {
  userID: string;
  action: ActionTypes;
  actionDetail: string;
  courseID: number;
}

async function getAllEvents({ courseID }: { courseID: number }): Promise<EventReturnType[]> {
  const data = await apiClient.get(`analytics/results/${courseID}`);
  return data.data as EventReturnType[];
}

interface ConsentInfoReturnType {
  current_consent: number;
  prev_consent: number;
  total: number;
}

async function getConsentInfo({ courseID }: { courseID: number }): Promise<ConsentInfoReturnType> {
  const data = await apiClient.get(`analytics/consent/${courseID}`);
  return data.data as ConsentInfoReturnType;
}

async function trackEvent({ userID, action, actionDetail, courseID }: TrackEventProps): Promise<void> {
  await apiClient
    .post('analytics/track', {
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
 * @param timestamp The timestamp to check.
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

export { getAllEvents, getConsentInfo, trackEvent, ActionTypes, isThisWeek, type EventReturnType };
