import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { ActionTypes, type EventReturnType } from '@/types/analytic';

const BIAS = 0.6;
const STUDENTS = 1000;

const MIN_PARTICIPANTS = Math.floor(STUDENTS * BIAS);
const MAX_PARTICIPANTS = Math.floor(STUDENTS * 0.85);
const PREV_PARTICIPANTS = Math.floor(Math.random() * STUDENTS);
const PARTICIPANTS = Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1)) + MIN_PARTICIPANTS;

const COURSE_LENGTH = 16; // weeks
const WEEKLY_EVENTS = 2;

const actionDetails: { [key in ActionTypes]: string[] } = {
  [ActionTypes.Page]: ['Student Dashboard', 'Student Settings'],
  [ActionTypes.Tile]: [
    'Quizzes',
    'Perusal',
    'Attendance',
    'Practice Sessions',
    'Preparation Time',
    'Send in Questions',
    'Exam Grades',
    'Learning Outcomes',
  ],
  [ActionTypes.TileView]: ['Switched View Type to Grid', 'Switched View Type to Graph'],
  [ActionTypes.Theme]: ['Switched Theme to Light', 'Switched Theme to Dark'],
  [ActionTypes.Notifications]: ['Opened Notifications'],
  [ActionTypes.SettingChange]: [
    `Change Goal Grade: ${String(Math.floor(Math.random() * 11))}`,
    'Enabled Notifications',
    'Disabled Notifications',
  ],
};

/**
 * Generates a random action type
 * @returns Random action type
 */
function getRandomActionType(): ActionTypes {
  const actionTypes = [0, 1, 2, 3, 4, 5] as ActionTypes[];
  const biases = [0.075, 0.5, 0.225, 0.05, 0.1, 0.05];
  const random = Math.random();

  let cumalativeWeight = 0;
  for (let i = 0; i < actionTypes.length; i++) {
    cumalativeWeight += biases[i] ?? 0;
    if (random <= cumalativeWeight) return actionTypes[i] ?? 0;
  }

  return ActionTypes.Tile;
}

/**
 * Generates a random index between 0 and arrayLength
 * @param arrayLength - The length of the array
 * @returns A random index
 */
function getRandomIndex(arrayLength: number): number {
  return Math.floor(Math.random() * arrayLength);
}

/**
 * Generates a random timestamp within the course length
 * @param previousTimestamp - The previous timestamp
 * @returns Random timestamp
 */
function getRandomTimestamp(previousTimestamp?: number): number {
  if (previousTimestamp) {
    // Generate a time stamp within half an hour of the previous timestamp
    const start = previousTimestamp - 60000;
    const end = previousTimestamp + 60000;
    return Math.floor(start + Math.random() * (end - start));
  }
  const end = new Date().getTime();
  const start = end - COURSE_LENGTH * 7 * 24 * 60 * 60 * 1000; // Convert weeks to milliseconds
  return Math.floor(start + Math.random() * (end - start));
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
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
}

/**
 * Generates mock data for analytics
 * @param amountOfUsers - The amount of users
 * @param maxNumberOfSessionsPerUser - The maximum number of sessions per user
 * @param maxNumberOfActionsPerSession - The maximum number of actions per session
 * @returns Mock data
 */
function getMockData(
  amountOfUsers = 100,
  maxNumberOfSessionsPerUser = 10,
  maxNumberOfActionsPerSession = 5,
): EventReturnType[] {
  const mockData: EventReturnType[] = [];

  const users: string[] = [];
  for (let i = 0; i < amountOfUsers; i++) users.push(getRandomUserId());

  for (const user of users) {
    const numberOfSessions = getRandomIndex(maxNumberOfSessionsPerUser) + 1;

    for (let i = 0; i < numberOfSessions; i++) {
      let previousTimestamp: number | undefined;
      const sessionId = getSessionId();

      let numberOfActions = 1;
      // To artificially increase the bounce rate, it is hard to get more than 1 action
      if (Math.random() > 0.9) numberOfActions += getRandomIndex(maxNumberOfActionsPerSession);

      for (let j = 0; j < numberOfActions; j++) {
        const timestamp = getRandomTimestamp(previousTimestamp);

        let action: ActionTypes;
        let actionDetail: string;

        if (j === 0) {
          action = ActionTypes.Page;
          actionDetail = 'Student Dashboard';
        } else {
          action = getRandomActionType();
          actionDetail = actionDetails[action][getRandomIndex(actionDetails[action].length)] ?? '';
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

export const analyticsHandlers = [
  http.get(basePath('api/analytic/results/*'), () => {
    return HttpResponse.json<EventReturnType[]>(getMockData(PARTICIPANTS, COURSE_LENGTH * WEEKLY_EVENTS, 20));
  }),

  http.get(basePath('api/analytic/consent/*'), () => {
    return HttpResponse.json({ current_consent: PARTICIPANTS, prev_consent: PREV_PARTICIPANTS, total: STUDENTS });
  }),
  http.post(basePath('api/analytic/track'), () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
