import { getCourseNotifications } from '@/api/users';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { NotificationStatus, type CourseNotificationDetail } from '@/types/notifications';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import { useMemo, useState, type FC, type ReactElement } from 'react';

const columns = [
  {
    title: 'Student Name',
    dataIndex: 'studentName',
    key: 'studentName',
  },
  {
    title: 'Received Notifications',
    dataIndex: 'receivedNotifications',
    key: 'receivedNotifications',
    render: (notifications: string) => <NotificationCell notifications={notifications} />,
  },
  {
    title: 'To Be Sent Notifications',
    dataIndex: 'toBeSentNotifications',
    key: 'toBeSentNotifications',
  },
];

const NotificationCell = ({ notifications }: { notifications: string }): ReactElement => {
  const [showAll, setShowAll] = useState(false);

  const notificationBlocks = notifications
    .trim()
    .split('\r\n\r\n')
    .map((block) => block.trim());

  const notificationArray = notifications.split('\r\n');
  const displayedNotifications = showAll ? notificationArray : notificationBlocks[0];

  return (
    <div className='flex flex-col gap-4'>
      <span>{typeof displayedNotifications === 'string' ? displayedNotifications : notifications}</span>
      <span>
        {notificationBlocks.length > 1 && (
          <Button
            className='custom-default-button'
            onClick={() => {
              setShowAll((prev) => !prev);
            }}
          >
            {showAll ? 'Show Less' : `Show More (${notificationBlocks.length - 1} more)`}
          </Button>
        )}
      </span>
    </div>
  );
};

const NotificationStatusToText = (status: NotificationStatus): string => {
  switch (status) {
    case NotificationStatus.closing_gap:
      return 'You are closing the gap to your peers in:';
    case NotificationStatus.falling_behind:
      return 'You are falling behind in:';
    case NotificationStatus.more_effort:
      return 'You have to put more effort in:';
    case NotificationStatus.outperforming:
      return 'You are outperforming your peers in:';
    default:
      return 'Unknown:';
  }
};

const NotificationCentre: FC = (): ReactElement => {
  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['course-notifications'],
    queryFn: async () => await getCourseNotifications(),
  });

  const tableData = useMemo(() => {
    return Object.entries(notifications ?? {}).map(
      ([studentName, notifications]: [string, CourseNotificationDetail[]], index) => {
        const receivedNotifications = notifications
          .filter((n) => n.sent !== null)
          .sort((a, b) => b.sent! - a.sent!)
          .reduce<Record<string, string[]>>((acc, n) => {
            const sentDate = new Date(n.sent!).toLocaleDateString();
            if (!acc[sentDate]) {
              acc[sentDate] = [];
            }
            acc[sentDate].push(`${NotificationStatusToText(n.status)} ${n.tile_title}`);
            return acc;
          }, {});

        const formattedNotifications = Object.entries(receivedNotifications)
          .map(([date, notifications]) => `${date}\r\n${notifications.join('\r\n')}`)
          .join('\r\n\r\n');

        const toBeSentNotifications = Array.from(
          new Set(
            notifications
              .filter((n) => n.sent === null)
              .map((n) => `${NotificationStatusToText(n.status)} ${n.tile_title}`),
          ),
        ).join('\r\n');

        return {
          key: index,
          studentName,
          receivedNotifications: formattedNotifications,
          toBeSentNotifications,
        };
      },
    );
  }, [notifications]);

  return (
    <>
      <AdminTitle title='Notification Centre' description='View all student notifications by synchronization' />
      {isError ?
        <QueryError className='relative' title='Failed to fetch notifications' />
      : <QueryLoading isLoading={isLoading}>
          <Table className='[&_td]:!whitespace-pre' columns={columns} dataSource={tableData} />
        </QueryLoading>
      }
    </>
  );
};

export default NotificationCentre;
