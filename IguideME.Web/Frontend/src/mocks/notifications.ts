import {
  CourseNotificationDetail,
  NotificationMap,
  NotificationStatus,
  type Notifications,
  type StudentNotification,
} from '@/types/notifications';
import { HttpResponse, http } from 'msw';
import { MOCK_TILES } from './tiles';
import { MOCK_STUDENTS } from './users';

export const notificationsHandlers = [
  http.get('/app/notifications/course', () => {
    const map: NotificationMap = {};
    const date = 1710057158270 + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000);
    const notifications = getRandomNotifications(10);
    const sent: CourseNotificationDetail[] = notifications.map((n) => ({
      ...n,
      sent: date + Math.random() * 7 * 24 * 60 * 60 * 1000,
    }));
    const current: CourseNotificationDetail[] = notifications.map((n) => ({ ...n, sent: null }));
    MOCK_STUDENTS.forEach((student) => {
      map[student.userID] = sent.concat(current);
    });

    return HttpResponse.json<NotificationMap>(map);
  }),
  http.get('/app/notifications/user/*', () => {
    const notifications = getRandomNotifications(10);
    return HttpResponse.json<Notifications>({
      outperforming: notifications.filter((n) => n.status === NotificationStatus.outperforming),
      closing: notifications.filter((n) => n.status === NotificationStatus.closing_gap),
      falling: notifications.filter((n) => n.status === NotificationStatus.falling_behind),
      effort: notifications.filter((n) => n.status === NotificationStatus.more_effort),
    });
  }),
];

function getRandomNotifications(max: number): StudentNotification[] {
  let notifications = [];
  for (let i = 0; i < Math.random() * max; i++) {
    notifications.push(getRandomNotification());
  }
  return notifications;
}
function getRandomNotification(): StudentNotification {
  const tileIndex = Math.floor(Math.random() * MOCK_TILES.length);

  return {
    tile_title: MOCK_TILES[tileIndex].title,
    status: Math.floor(Math.random() * 4),
  };
}
