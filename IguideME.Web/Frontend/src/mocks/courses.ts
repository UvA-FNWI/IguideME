import { Course, WorkflowStates } from '@/api/courses';
import { User } from '@/types/user';
import { http, HttpResponse } from 'msw';
import { MOCK_STUDENTS } from './users';

export const courseHandlers = [
  http.get('/api/courses/:courseId', ({ params }) => {
    const courseId = params.courseId;
    const course = exampleCourses.find((course) => course.id === +courseId!);

    if (!course) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json<Course>(course);
  }),

  http.get('/api/courses', () => {
    return HttpResponse.json<Course[]>(exampleCourses);
  }),

  http.get('/api/courses/:courseId/students', ({ params }) => {
    const courseId = params.courseId;
    const course = exampleCourses.find((course) => course.id === +courseId!);
    if (!course) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json<User[]>(MOCK_STUDENTS);
  }),
];

const exampleCourses: Course[] = [
  {
    id: 0,
    name: 'Physics',
    courseCode: 'PHY101',
    workflowState: WorkflowStates.COMPLETED,
    isPublic: true,
    courseImage:
      'https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-action-60582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 1,
    name: 'Mathematics',
    courseCode: 'MAT101',
    workflowState: WorkflowStates.AVAILABLE,
    isPublic: true,
    courseImage:
      'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    name: 'Chemistry',
    courseCode: 'CHE101',
    workflowState: WorkflowStates.UNPUBLISHED,
    isPublic: false,
    courseImage:
      'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];
