import { ActionTypes, EventReturnType } from '@/utils/analytics';
import { http, HttpResponse } from 'msw';

const BIAS = 0.6;
const STUDENTS = 100;

const MIN_PARTICIPANTS = Math.floor(STUDENTS * BIAS);
const PARTICIPANTS = Math.floor(Math.random() * (STUDENTS - MIN_PARTICIPANTS + 1)) + MIN_PARTICIPANTS;

const COURSE_LENGTH = 8; // weeks
const WEEKLY_EVENTS = 2;

export const analyticsHandlers = [
  http.get('/analytics/events/*', () => {
    return HttpResponse.json<EventReturnType[]>(getMockData(PARTICIPANTS, COURSE_LENGTH * WEEKLY_EVENTS, 20));
  }),

  http.get('/analytics/consent/*', () => {
    return HttpResponse.json({ consent: PARTICIPANTS, total: STUDENTS });
  }),
];

const actionDetails: { [key in ActionTypes]: string[] } = {
  [ActionTypes.page]: ['visited page student dashboard', 'visited page student settings'],
  [ActionTypes.tile]: [
    'opened quizzes',
    'opened perusal',
    'opened attendance',
    'opened practice sessions',
    'opened preparation time',
    'opened send in questions',
    'opened exam grades',
    'opened learning outcomes',
  ],
  [ActionTypes.tileView]: ['switched view type to grid', 'switched view type to graph'],
  [ActionTypes.theme]: ['switched theme to light', 'switched theme to dark'],
  [ActionTypes.notifications]: ['opened notifications'],
  [ActionTypes.settingChange]: [
    'goal grade: ' + Math.floor(Math.random() * 11),
    'enabled notifications',
    'disabled notifications',
  ],
};

/**
 * Generates a random index between 0 and arrayLength
 * @param arrayLength The length of the array
 * @returns Random index between 0 and arrayLength
 */
function getRandomIndex(arrayLength: number): number {
  return Math.floor(Math.random() * arrayLength);
}

/**
 * Generates a random timestamp between 2020-01-01 and now
 * @returns Random timestamp between 2020-01-01 and now
 */
function getRandomTimestamp(previousTimestamp?: number): number {
  if (previousTimestamp) {
    // Generate a time stamp within half an hour of the previous timestamp
    const start = previousTimestamp - 1800000;
    const end = previousTimestamp + 1800000;
    return Math.floor(start + Math.random() * (end - start));
  } else {
    const end = new Date().getTime();
    const start = end - COURSE_LENGTH * 7 * 24 * 60 * 60 * 1000; // Convert weeks to milliseconds
    return Math.floor(start + Math.random() * (end - start));
  }
}

/**
 * Generates a random user id
 * @returns Random user id
 */
function getRandomUserId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Generates a random session id
 * @returns A session id
 */
function getSessionId(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

function getMockData(
  amountOfUsers: number = 100,
  maxNumberOfSessionsPerUser: number = 10,
  maxNumberOfActionsPerSession: number = 5,
): EventReturnType[] {
  const mockData: EventReturnType[] = [];

  const users: string[] = [];
  for (let i = 0; i < amountOfUsers; i++) users.push(getRandomUserId());

  for (const user in users) {
    const numberOfSessions = getRandomIndex(maxNumberOfSessionsPerUser) + 1;
    for (let i = 0; i < numberOfSessions; i++) {
      let previousTimestamp: number | undefined;
      const sessionId = getSessionId();
      const numberOfActions = getRandomIndex(maxNumberOfActionsPerSession) + 1;
      for (let j = 0; j < numberOfActions; j++) {
        const timestamp = getRandomTimestamp(previousTimestamp);

        let action: ActionTypes;
        let actionDetail: string;

        if (j === 0) {
          action = ActionTypes.page;
          actionDetail = 'Student Dashboard';
        } else {
          action = getRandomIndex(Object.keys(ActionTypes).length / 2);
          actionDetail = actionDetails[action][getRandomIndex(actionDetails[action].length)];
        }

        mockData.push({
          timestamp,
          user_id: user,
          action,
          action_detail: actionDetail,
          session_id: sessionId,
          course_id: 1,
        });

        previousTimestamp = timestamp;
      }
    }
  }

  return mockData;
}
