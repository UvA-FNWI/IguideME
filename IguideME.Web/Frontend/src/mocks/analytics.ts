import { http, HttpResponse } from 'msw';
import { ActionTypes, type EventReturnType } from '@/utils/analytics';

const BIAS = 0.6;
const STUDENTS = 1000;

const MIN_PARTICIPANTS = Math.floor(STUDENTS * BIAS);
const MAX_PARTICIPANTS = Math.floor(STUDENTS * 0.85);
const PREV_PARTICIPANTS = Math.floor(Math.random() * STUDENTS);
const PARTICIPANTS = Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1)) + MIN_PARTICIPANTS;

const COURSE_LENGTH = 16; // weeks
const WEEKLY_EVENTS = 12;

// The probability that a user will perform events during the week
const WEEK_BIAS = [
  0.91155614, 0.44565056, 0.62248324, 0.92263308, 0.87416309, 0.51110266, 0.6227691, 0.78215291, 0.34756728, 0.74747028,
  0.72179816, 0.9278932, 0.83104332, 0.94336995, 0.9778625, 0.92513745,
];
if (WEEK_BIAS.length !== COURSE_LENGTH) throw new Error('Week bias must be the same length as the course length');

export const analyticsHandlers = [
  // Using results instead of events as some adblockers block it otherwise.
  http.get('/analytics/results/*', () => {
    return HttpResponse.json<EventReturnType[]>(getMockData(PARTICIPANTS));
  }),

  http.get('/analytics/consent/*', () => {
    return HttpResponse.json({ current_consent: PARTICIPANTS, prev_consent: PREV_PARTICIPANTS, total: STUDENTS });
  }),
  http.post('/analytics/track', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

const actionDetails: { [key in ActionTypes]: string[] } = {
  [ActionTypes.page]: ['Student Dashboard', 'Student Settings'],
  [ActionTypes.tile]: ['1', '2', '3', '4', '5'],
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
function getRandomTimestamp(previousTimestamp: number | null, week: number): number {
  const startCourse = new Date('2023-01-01'); // Consistent start date for the course
  const endCourse = new Date(startCourse.getTime() + COURSE_LENGTH * 7 * 24 * 60 * 60 * 1000);

  let time: number | null = null;
  if (previousTimestamp) {
    // Generate a time stamp within half an hour of the previous timestamp
    const start = new Date(previousTimestamp);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    time = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
  } else {
    if (week > COURSE_LENGTH) throw new Error('Week cannot be greater than the course length');

    let weekStart: Date;
    let weekEnd: Date;

    if (week === 0) {
      // Calculate the remaining days in the first week from the start date
      weekStart = startCourse;
      weekEnd = new Date(startCourse.getTime() + (7 - startCourse.getDay()) * 24 * 60 * 60 * 1000);
    } else {
      // Calculate the start date of the specified week
      weekStart = new Date(startCourse.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
      // Calculate the end date of the specified week
      weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // Generate a random timestamp within the specified week
    time = new Date(weekStart.getTime() + Math.random() * (weekEnd.getTime() - weekStart.getTime())).getTime();
  }

  // Validate if the timestamp is within the course length
  if (time < startCourse.getTime() || time > endCourse.getTime()) {
    throw new Error('Timestamp is not within the course length');
  }

  return time;
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
  amountOfUsers: number,
  amountOfPossibleActions: number = 6,
  weeklyEvents: number = WEEKLY_EVENTS,
  courseLength: number = COURSE_LENGTH,
): EventReturnType[] {
  const mockData: EventReturnType[] = [];

  const users: string[] = [];
  for (let i = 0; i < amountOfUsers; i++) users.push(getRandomUserId());

  for (const user of users) {
    for (let week = 0; week < courseLength; week++) {
      // Let the user participate in a random amount of weekly events
      const participatedEvents = getRandomIndex(weeklyEvents);
      for (let event = 0; event < participatedEvents; event++) {
        if (Math.random() > WEEK_BIAS[week]) continue;

        // Let the user perform a random amount of actions
        const amountOfActions = getRandomIndex(amountOfPossibleActions);

        // Since each event must be in the same session, each timestamp must be
        // within 30 minutes of the previous timestamp.
        let previousTimestamp = null;

        // Each event belongs to the same session
        const sessionID = getSessionId();

        for (let action = 0; action < amountOfActions; action++) {
          const timestamp = getRandomTimestamp(previousTimestamp, week);
          previousTimestamp = timestamp;

          const action = getRandomActionType();
          const actionDetail = actionDetails[action][getRandomIndex(actionDetails[action].length)];

          mockData.push({
            timestamp,
            user_id: user,
            action,
            action_detail: actionDetail,
            session_id: sessionID,
            course_id: 1,
          });
        }
      }
    }
  }

  return mockData;
}
