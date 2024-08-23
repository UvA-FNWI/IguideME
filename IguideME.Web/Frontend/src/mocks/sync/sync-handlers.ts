import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import { type Synchronization } from '@/types/sync';

import { MOCK_SYNCHRONIZATIONS } from './sync-example-data';

export const syncHandlers = [
  http.get(basePath('api/datamart/synchronizations'), () => {
    return HttpResponse.json<Synchronization[]>(MOCK_SYNCHRONIZATIONS);
  }),

  http.get(basePath('api/datamart/status'), () => {
    return HttpResponse.json();
  }),

  http.post(basePath('api/datamart/start-sync'), () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(basePath('api/datamart/stop-sync'), () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
