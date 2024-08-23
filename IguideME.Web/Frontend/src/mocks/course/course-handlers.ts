import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { MOCK_STUDENTS } from '@/mocks/user/user-example-data';
import { type Course, WorkflowStates } from '@/types/course';
import { type User } from '@/types/user';

import exampleCourses from './course-example-data.json';

function convertStringToWorkflowState(state: string): WorkflowStates {
  switch (state) {
    case 'UNPUBLISHED':
      return WorkflowStates.UNPUBLISHED;
    case 'AVAILABLE':
      return WorkflowStates.AVAILABLE;
    case 'COMPLETED':
      return WorkflowStates.COMPLETED;
    default:
      throw new Error(`Unknown workflow state: ${state}`);
  }
}

export const courseHandlers = [
  http.get(basePath('/api/course/:courseId'), ({ params }) => {
    const courseId = params.courseId;
    const course = exampleCourses.find((c) => c.id === Number(courseId));

    if (!course) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json<Course>({ ...course, workflowState: convertStringToWorkflowState(course.workflowState) });
  }),

  http.get(basePath('/api/course'), () => {
    const updatedCourses = exampleCourses.map((course) => ({
      ...course,
      workflowState: convertStringToWorkflowState(course.workflowState),
    }));

    return HttpResponse.json<Course[]>(updatedCourses);
  }),

  http.get(basePath('/api/course/:courseId/student'), ({ params }) => {
    const courseId = params.courseId;
    const course = exampleCourses.find((c) => c.id === Number(courseId));
    if (!course) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json<User[]>(MOCK_STUDENTS);
  }),
];
