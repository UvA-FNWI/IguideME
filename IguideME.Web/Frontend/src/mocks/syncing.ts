import { JobStatus, PollSyncData, type Synchronization } from '@/types/synchronization';
import dayjs from 'dayjs';
import { http, HttpResponse } from 'msw';

export const syncingHandlers = [
  http.get('/datamart/synchronizations', () => {
    return HttpResponse.json<Synchronization[]>(MOCK_SYNCHRONIZATIONS);
  }),
  http.get('/datamart/status', () => {
    return HttpResponse.json<PollSyncData>(MOCK_SYNC_STATUS);
  }),
  http.post('/datamart/start-sync', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post('/datamart/stop-sync', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

const MOCK_SYNCHRONIZATIONS: Synchronization[] = [
  {
    start_timestamp: 1684499453123,
    end_timestamp: 1684499553123,
    invoked: 'IGUIDEME SYSTEM',
    status: 'COMPLETE',
  },
  {
    start_timestamp: 1684459453123,
    end_timestamp: 1684459653123,
    invoked: 'IGUIDEME SYSTEM',
    status: 'COMPLETE',
  },
  {
    start_timestamp: 1684359453213,
    end_timestamp: null,
    invoked: 'Demo Account',
    status: 'INCOMPLETE',
  },
];

const MOCK_SYNC_STATUS: PollSyncData = {
  '': {
    startTime: dayjs('2025-02-20T11:40:20.0355154Z').unix().toString(),
    lastUpdate: dayjs('2025-02-20T11:40:28.1258549Z').unix().toString(),
    status: JobStatus.Success,
    progressInformation:
      'tasks.boot-up:Success,tasks.students:Success,tasks.quizzes:Success,tasks.discussions:Success,tasks.assignments:Success,tasks.peer-groups:Success,tasks.notifications:Success,tasks.done:Success',
  },
};
