import { http, HttpResponse } from 'msw';

import { type Notifications, type StudentNotification } from '@/types/notification';

import {
  MOCK_NOTIFICATIONS_CLOSING,
  MOCK_NOTIFICATIONS_EFFORT,
  MOCK_NOTIFICATIONS_FALLING,
  MOCK_NOTIFICATIONS_OUTPERFORMING,
} from './notification-example-data';

export const notificationHandlers = [
  http.get('/api/notification/:userId', ({ params }) => {
    const userId = params.userId;

    const filterByUserIdAndSent = (notification: StudentNotification): boolean => {
      return notification.userID === userId && notification.sent;
    };

    return HttpResponse.json<Notifications>({
      outperforming: MOCK_NOTIFICATIONS_OUTPERFORMING.filter(filterByUserIdAndSent),
      closing: MOCK_NOTIFICATIONS_CLOSING.filter(filterByUserIdAndSent),
      falling: MOCK_NOTIFICATIONS_FALLING.filter(filterByUserIdAndSent),
      effort: MOCK_NOTIFICATIONS_EFFORT.filter(filterByUserIdAndSent),
    });
  }),
];
