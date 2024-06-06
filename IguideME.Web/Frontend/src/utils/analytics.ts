import apiClient from '@/api/axios';

export enum ActionTypes {
  page,
  tile,
  tileView,
  theme,
  notifications,
  settingChange,
}

export interface EventReturnType {
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

export class Analytics {
  static async getAllEvents({ courseID }: { courseID: number }) {
    try {
      const data = await apiClient.get(`analytics/events/${courseID}`);
      return data.data as EventReturnType[];
    } catch (error) {
      console.log('Error fetching events', error);
      throw error;
    }
  }

  static async getConsentInfo({ courseID }: { courseID: number }) {
    try {
      const data = await apiClient.get(`analytics/consent/${courseID}`);
      return data.data as { current_consent: number; prev_consent: number; total: number };
    } catch (error) {
      console.log('Error fetching consent info', error);
      throw error;
    }
  }

  static async trackEvent({ userID, action, actionDetail, courseID }: TrackEventProps) {
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
}

/**
 * Check if the given timestamp lays in the current week number.
 * @param timestamp The timestamp to check.
 * @returns True if the timestamp is in the current week, false otherwise.
 */
export function isThisWeek(timestamp: number): boolean {
  const eventDate = new Date(timestamp);
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  return eventDate >= startOfWeek;
}
