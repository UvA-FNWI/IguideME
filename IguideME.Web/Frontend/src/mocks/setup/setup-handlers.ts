import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';

export const setupHandlers = [
  http.post(basePath('api/setup'), () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
