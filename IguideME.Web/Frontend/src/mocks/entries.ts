import { http, HttpResponse } from 'msw';
import {
  GradingType,
  type Assignment,
  type DiscussionTopic,
  type LearningGoal,
  LogicalExpression,
  DiscussionEntry,
} from '@/types/tile';

export const entriesHandlers = [
  http.get('/assignments', () => {
    const resp: any = {};
    MOCK_ASSIGNMENTS.forEach((ass) => {
      resp[ass.id] = ass;
    });
    return HttpResponse.json(resp);
  }),
  http.get('/topics', () => {
    return HttpResponse.json<DiscussionTopic[]>(MOCK_TOPICS);
  }),
  http.get('/discussions/*/*', ({ params }) => {
    return HttpResponse.json<DiscussionTopic>(
      MOCK_TOPICS.find((disc) => disc.id.toString() === params[0] && disc.author === params[1]),
    );
  }),
  http.get('/discussions/*', ({ params }) => {
    return HttpResponse.json<DiscussionEntry>(MOCK_DISCUSSION_ENTRIES.find((disc) => disc.author === params[0]));
  }),
  http.get('/learning-goals', () => {
    return HttpResponse.json<LearningGoal[]>(MOCK_GOALS);
  }),
  http.post('/learning-goals/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/learning-goals/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete('/learning-goals/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post('/learning-goals/requirements/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.patch('/learning-goals/requirements/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete('/learning-goals/requirements/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    course_id: 17320,
    title: 'Quiz 1: Anatomische termen van positie',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 2,
    course_id: 17320,
    title: 'Quiz 3: Neurotransmitter systemen',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 3,
    course_id: 17320,
    title: 'Quiz 2: Macro Anatomie',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 4,
    course_id: 17320,
    title: 'Quiz 4: Micro anatomie',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 5,
    course_id: 17320,
    title: 'Cijfers deeltoets 1',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 6,
    course_id: 17320,
    title: 'Cijfers deeltoets 2',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 7,
    course_id: 17320,
    title: 'Cijfer presentatie',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 8,
    course_id: 17320,
    title: 'Cijfer deeltoets 3',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 9,
    course_id: 17320,
    title: 'Perusall assignment 1',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 10,
    course_id: 17320,
    title: 'Perusall assignment 2',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 11,
    course_id: 17320,
    title: 'Perusall assignment 3',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 10.0,
    grading_type: GradingType.Points,
  },
  {
    id: 12,
    course_id: 17320,
    title: 'Artikelen college DSM',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
  {
    id: 13,
    course_id: 17320,
    title: 'Artikelen college Alzheimer',
    published: true,
    muted: false,
    due_date: 1707688872519,
    max_grade: 1.0,
    grading_type: GradingType.Points,
  },
  {
    id: 14,
    course_id: 17320,
    title: 'Artikelen college Migraine',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 1.0,
    grading_type: GradingType.Points,
  },
  {
    id: 15,
    course_id: 17320,
    title: 'Artikelen college Epilepsie',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
  {
    id: 16,
    course_id: 17320,
    title: 'Artikelen college Eetstoornissen',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
  {
    id: 17,
    course_id: 17320,
    title: 'Artikelen college Pijn en Angst',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
  {
    id: 18,
    course_id: 17320,
    title: 'Artikel college MS',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
  {
    id: 19,
    course_id: 17320,
    title: 'Artikelen college Depressie',
    published: false,
    muted: false,
    due_date: 1707688872519,
    max_grade: 0.0,
    grading_type: GradingType.Points,
  },
];

export const MOCK_TOPICS: DiscussionTopic[] = [
  {
    id: 1,
    parent_id: 0,
    course_id: 994,
    title: 'Third discussion',
    author: '46647543',
    date: 1602173738,
    message: 'Discussion number 3',
  },
  {
    id: 2,
    parent_id: 0,
    course_id: 994,
    title: 'Second discussion',
    author: '55571292',
    date: 1602173834,
    message: 'Discussion number 2',
  },
  {
    id: 3,
    parent_id: 0,
    course_id: 994,
    title: 'First discussion',
    author: '45476233',
    date: 1602173991,
    message: 'Discussion number 1',
  },
];

export const MOCK_DISCUSSION_ENTRIES: DiscussionEntry[] = [];

export const MOCK_GOALS: LearningGoal[] = [
  {
    id: 1,
    title: 'Quiz Bonus',
    requirements: [
      {
        id: 1,
        goal_id: 1,
        assignment_id: 1,
        value: 5,
        expression: LogicalExpression.GreaterEqual,
      },
      {
        id: 1,
        goal_id: 1,
        assignment_id: 2,
        value: 5,
        expression: LogicalExpression.GreaterEqual,
      },
      {
        id: 1,
        goal_id: 1,
        assignment_id: 3,
        value: 5,
        expression: LogicalExpression.GreaterEqual,
      },
      {
        id: 1,
        goal_id: 1,
        assignment_id: 4,
        value: 5,
        expression: LogicalExpression.GreaterEqual,
      },
    ],
  },
];
