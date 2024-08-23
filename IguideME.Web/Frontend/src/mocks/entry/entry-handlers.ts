import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { MOCK_SUBMISSIONS } from '@/mocks/tile/grade-example-data';
import {
  type Assignment,
  type DiscussionEntry,
  type DiscussionTopic,
  type LearningGoal,
  LogicalExpression,
  type Submission,
} from '@/types/tile';

import { MOCK_ASSIGNMENTS, MOCK_DISCUSSION_ENTRIES, MOCK_GOALS, MOCK_TOPICS } from './entry-example-data';

export const entryHandlers = [
  // ------
  // Assignments
  // ------

  http.get(basePath('api/assignment'), () => {
    const resp: Record<number, Assignment> = {};
    MOCK_ASSIGNMENTS.forEach((ass) => {
      resp[ass.id] = ass;
    });
    return HttpResponse.json(resp);
  }),

  http.get(basePath('api/assignment/:contentId/submission/:userId'), ({ params }) => {
    return HttpResponse.json<Submission | undefined>(
      MOCK_SUBMISSIONS.find((sub) => sub.assignmentID.toString() === params.contentId && sub.userID === params.userId),
    );
  }),

  // ------
  // Discussions
  // ------

  http.get(basePath('api/discussion/topic'), () => {
    return HttpResponse.json<DiscussionTopic[]>(MOCK_TOPICS);
  }),

  http.get(basePath('api/discussion/:contentId/:studentId'), ({ params }) => {
    return HttpResponse.json<DiscussionTopic>(MOCK_TOPICS.find((disc) => disc.id.toString() === params.contentId));
  }),

  http.get(basePath('api/discussion/:userId'), ({ params }) => {
    return HttpResponse.json<DiscussionEntry>(MOCK_DISCUSSION_ENTRIES.find((disc) => disc.author === params.contentId));
  }),

  // ------
  // Learning Goals
  // ------

  http.get(basePath('api/learning-goal'), () => {
    return HttpResponse.json<LearningGoal[]>(MOCK_GOALS);
  }),

  http.get(basePath('api/learning-goal/:contentId/:studentId'), ({ params }) => {
    const goal = MOCK_GOALS.find((g) => g.id.toString() === params.contentId);
    if (!goal) return;

    goal.results = goal.requirements.map((req) => {
      const grade =
        MOCK_SUBMISSIONS.find((sub) => sub.assignmentID === req.assignment_id && sub.userID === params.studentId)
          ?.grades.grade ?? 0;

      switch (req.expression) {
        case LogicalExpression.NotEqual:
          return grade !== req.value;
        case LogicalExpression.Less:
          return grade < req.value;
        case LogicalExpression.LessEqual:
          return grade <= req.value;
        case LogicalExpression.Equal:
          return grade === req.value;
        case LogicalExpression.GreaterEqual:
          return grade > req.value;
        case LogicalExpression.Greater:
          return grade >= req.value;
        default:
          return false;
      }
    });

    return HttpResponse.json<LearningGoal | undefined>(goal);
  }),

  http.post(basePath('api/learning-goal/:goalId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(basePath('api/learning-goal/:goalId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete(basePath('api/learning-goal/:stringId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ------
  // Goal Requirements
  // ------

  http.post(basePath('api/learning-goal/requirement/:requirementId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(basePath('api/learning-goal/requirement/:requirementId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete(basePath('api/learning-goal/requirement/:requirementId'), () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
