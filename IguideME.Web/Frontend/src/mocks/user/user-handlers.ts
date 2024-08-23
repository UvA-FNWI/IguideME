import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { type User, UserRoles } from '@/types/user';

import { MOCK_STUDENTS } from './user-example-data';

export const userHandlers = [
  http.get(basePath('api/user/student'), () => {
    return HttpResponse.json<User[]>(MOCK_STUDENTS);
  }),

  http.get(basePath('api/user/student/:userId'), ({ params }) => {
    const userId = params.userId as string;
    const student = MOCK_STUDENTS.find((s) => s.userID === userId);
    if (student === undefined) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json<User>(student);
  }),

  http.get(basePath('api/user/self'), () => {
    return HttpResponse.json<User>({
      course_id: 994,
      studentnumber: 42,
      userID: '42',
      name: 'Course Admin',
      sortable_name: 'Admin, Course',
      role: UserRoles.Instructor,
      settings: undefined,
    });
  }),
];
