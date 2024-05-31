import { http, HttpResponse } from 'msw';
import { ActionTypes, type EventReturnType } from '@/utils/analytics';

const BIAS = 0.6;
const STUDENTS = 1000;

const MIN_PARTICIPANTS = Math.floor(STUDENTS * BIAS);
const MAX_PARTICIPANTS = Math.floor(STUDENTS * 0.85);
const PREV_PARTICIPANTS = Math.floor(Math.random() * STUDENTS);
const PARTICIPANTS = Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1)) + MIN_PARTICIPANTS;

const COURSE_LENGTH = 16; // weeks
const WEEKLY_EVENTS = 2;

export const analyticsHandlers = [
  http.get('/analytics/events/*', () => {
    return HttpResponse.json<EventReturnType[]>(getMockData(PARTICIPANTS, COURSE_LENGTH * WEEKLY_EVENTS, 20));
  }),

  http.get('/analytics/consent/*', () => {
    return HttpResponse.json({ current_consent: PARTICIPANTS, prev_consent: PREV_PARTICIPANTS, total: STUDENTS });
  }),
];

const actionDetails: { [key in ActionTypes]: string[] } = {
  [ActionTypes.page]: ['Student Dashboard', 'Student Settings'],
  [ActionTypes.tile]: [
    'Quizzes',
    'Perusal',
    'Attendance',
    'Practice Sessions',
    'Preparation Time',
    'Send in Questions',
    'Exam Grades',
    'Learning Outcomes',
  ],
  [ActionTypes.tileView]: ['Switched View Type to Grid', 'Switched View Type to Graph'],
  [ActionTypes.theme]: ['Switched Theme to Light', 'Switched Theme to Dark'],
  [ActionTypes.notifications]: ['Opened Notifications'],
  [ActionTypes.settingChange]: [
    'Change Goal Grade: ' + Math.floor(Math.random() * 11),
    'Enabled Notifications',
    'Disabled Notifications',
  ],
};

function getRandomActionType(): ActionTypes {
  const actionTypes = [0, 1, 2, 3, 4, 5] as ActionTypes[];
  const biases = [0.075, 0.5, 0.225, 0.05, 0.1, 0.05];
  const random = Math.random();

  let cumalativeWeight = 0;
  for (let i = 0; i < actionTypes.length; i++) {
    cumalativeWeight += biases[i];
    if (random <= cumalativeWeight) return actionTypes[i];
  }

  return ActionTypes.tile;
}

/**
 * Generates a random index between 0 and arrayLength
 * @param arrayLength The length of the array
 * @returns A random index
 */
function getRandomIndex(arrayLength: number): number {
  return Math.floor(Math.random() * arrayLength);
}

/**
 * Generates a random timestamp within the course length
 * @param previousTimestamp The previous timestamp
 * @returns Random timestamp
 */
function getRandomTimestamp(previousTimestamp?: number): number {
  if (previousTimestamp) {
    // Generate a time stamp within half an hour of the previous timestamp
    const start = previousTimestamp - 60000;
    const end = previousTimestamp + 60000;
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
          action = ActionTypes.page;
          actionDetail = 'Student Dashboard';
        } else {
          action = getRandomActionType();
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
