import { NotificationStatus, type Notifications, type StudentNotification } from '@/types/notifications';
import { HttpResponse, http } from 'msw';

export const notificationsHandlers = [
  http.get('/app/notifications/user/*', ({ params }) => {
    const userID = params[0];
    return HttpResponse.json<Notifications>({
      outperforming: MOCK_NOTIFICATIONS_OUTPERFORMING.filter(
        (notification) => notification.userID === userID && notification.sent,
      ),
      closing: MOCK_NOTIFICATIONS_CLOSING.filter((notification) => notification.userID === userID && notification.sent),
      falling: MOCK_NOTIFICATIONS_FALLING.filter((notification) => notification.userID === userID && notification.sent),
      effort: MOCK_NOTIFICATIONS_EFFORT.filter((notification) => notification.userID === userID && notification.sent),
    });
  }),

  http.get('/app/notifications/course', () => {
    return HttpResponse.json({
      '1': {
        end_timestamp: 1695800000,
        student_name: 'John Doe',
        notifications: [
          {
            tile_title: 'Title',
            status: 0,
            sent: false,
          },
          {
            tile_title: 'Title',
            status: 0,
            sent: false,
          },
        ],
      },
      '2': {
        end_timestamp: 1695900000,
        student_name: 'Jane Smith',
        notifications: [
          {
            tile_title: 'Title',
            status: 1,
            sent: true,
          },
        ],
      },
    });
  }),
];

const MOCK_NOTIFICATIONS_OUTPERFORMING: StudentNotification[] = [
  {
    userID: '28332183',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '28332183',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '95366984',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '95366984',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '45844627',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '45844627',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '54264654',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '54264654',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '46666218',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '46666218',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '41149744',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '41149744',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '35683215',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '35683215',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '50326251',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '50326251',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '96600883',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '96600883',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '24585559',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '24585559',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '16967126',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '16967126',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '23744275',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '23744275',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '53036575',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '53036575',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '41898388',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '41898388',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '59540503',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '59540503',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '45476233',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '45476233',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '29376337',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '29376337',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '27034712',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '27034712',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '74114284',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '74114284',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '55249485',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '55249485',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '43219917',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '43219917',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '23400528',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '23400528',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '95372011',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '95372011',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '46647543',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '46647543',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '20936679',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '20936679',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '70805720',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '70805720',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '32324131',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '32324131',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '66889858',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '66889858',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '90434281',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '90434281',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '22976781',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '22976781',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '86899376',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '86899376',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '48470625',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '48470625',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '18298956',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '18298956',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '74886921',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '74886921',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '77161172',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '77161172',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '81888190',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '81888190',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '31665008',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '31665008',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '35251913',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '35251913',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '27817769',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '27817769',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '41393783',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '41393783',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '28624178',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '28624178',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '97222205',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '97222205',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '21276717',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '21276717',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '81005245',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '81005245',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '38152009',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '38152009',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '76262947',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '76262947',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '20380320',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '20380320',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '48905367',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '48905367',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '42345728',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '42345728',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '96955357',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '96955357',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '43754947',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '43754947',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '41803722',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '41803722',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '55571292',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '55571292',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
  {
    userID: '52682411',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: true,
  },
  {
    userID: '52682411',
    tile_id: 2,
    tile_title: 'Perusall',
    status: NotificationStatus.outperforming,
    sent: false,
  },
];

const MOCK_NOTIFICATIONS_CLOSING: StudentNotification[] = [
  {
    userID: '28332183',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '95366984',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '45844627',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '54264654',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '46666218',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '41149744',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '35683215',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '50326251',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '96600883',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '24585559',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '16967126',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '23744275',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '53036575',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '41898388',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '59540503',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '45476233',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '29376337',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '27034712',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '74114284',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '55249485',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '43219917',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '23400528',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '95372011',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '46647543',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '20936679',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '70805720',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '32324131',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '66889858',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '90434281',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '22976781',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '86899376',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '48470625',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '18298956',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '74886921',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '77161172',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '81888190',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '31665008',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '35251913',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '27817769',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '41393783',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '28624178',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '97222205',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '21276717',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '81005245',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '38152009',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '76262947',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '20380320',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '48905367',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '42345728',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '96955357',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '43754947',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '41803722',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '55571292',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
  {
    userID: '52682411',
    tile_id: 4,
    tile_title: 'Practice Sessions',
    status: NotificationStatus.closing_gap,
    sent: false,
  },
];

const MOCK_NOTIFICATIONS_FALLING: StudentNotification[] = [];
const MOCK_NOTIFICATIONS_EFFORT: StudentNotification[] = [];
