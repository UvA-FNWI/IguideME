import { CourseNotificationDetail, NotificationMap, type StudentNotification } from '@/types/notifications';
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
    return HttpResponse.json(notifications);
  }),
];

function getRandomNotifications(max: number): StudentNotification[] {
  let notifications = [];
  for (let i = 0; i < Math.random() * max; i++) {
    const n =getRandomNotification();
    n && notifications.push(n);
  }
  return notifications;
}
function getRandomNotification(): StudentNotification | null {
  const tileIndex = Math.floor(Math.random() * MOCK_TILES.length);
  const tile = MOCK_TILES[tileIndex];
  if (tile.visible === false)  return null;

  return {
    tile_title: tile.title,
    status: Math.floor(Math.random() * 4),
  };
}
