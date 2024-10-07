import { NotificationStatus, type Notifications, type StudentNotification } from '@/types/notifications';
import { HttpResponse, http } from 'msw';

export const notificationsHandlers = [
  http.get('/app/notifications/user/*', () => {
    function getRandomNotification(notifications: StudentNotification[]): StudentNotification {
      const randomIndex = Math.floor(Math.random() * notifications.length);
      return notifications[randomIndex];
    }

    return HttpResponse.json<Notifications>({
      outperforming: [getRandomNotification(MOCK_NOTIFICATIONS_OUTPERFORMING)],
      closing: [getRandomNotification(MOCK_NOTIFICATIONS_CLOSING)],
      falling: [getRandomNotification(MOCK_NOTIFICATIONS_FALLING)],
      effort: [getRandomNotification(MOCK_NOTIFICATIONS_EFFORT)],
    });
  }),
];

const MOCK_NOTIFICATIONS_OUTPERFORMING: StudentNotification[] = [
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
  {
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
  },
];

const MOCK_NOTIFICATIONS_CLOSING: StudentNotification[] = [
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
  {
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
  },
];

const MOCK_NOTIFICATIONS_FALLING: StudentNotification[] = [];
const MOCK_NOTIFICATIONS_EFFORT: StudentNotification[] = [];
