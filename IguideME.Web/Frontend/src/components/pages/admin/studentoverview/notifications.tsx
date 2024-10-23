import { NotificationMap, NotificationStatus } from '@/types/notifications';
import { Button, TableColumnsType } from 'antd';
import { useState, type ReactElement } from 'react';
import { CommonData } from './common-table';
import { User } from '@/types/user';

interface NotificationData {
  received?: string;
  to_be_sent?: string;
}

export const getNotificationColumns = (): TableColumnsType<CommonData & NotificationData> => {
  return [
    {
      title: 'Received Notifications',
      dataIndex: 'received',
      key: 'received',
      width: '40%',
      render: (notifications: string | undefined) => <NotificationCell notifications={notifications} />,
    },
    {
      title: 'To Be Sent Notifications',
      dataIndex: 'to_be_sent',
      key: 'to_be_sent',
      width: '40%',
    },
  ];
};

export const getNotificationData = (
  students: User[],
  notifications: NotificationMap | undefined,
): (CommonData & NotificationData)[] => {
  return students.map((student, index) => {
    const student_notifications = notifications?.[student.userID];
    if (!student_notifications) {
      return { student, name: student.name, key: index.toString() };
    }
    const received = student_notifications
      ?.filter((n) => n.sent !== null)
      .sort((a, b) => b.sent! - a.sent!)
      .reduce<Record<string, string[]>>((acc, n) => {
        const sentDate = new Date(n.sent!).toLocaleDateString();
        if (!acc[sentDate]) {
          acc[sentDate] = [];
        }
        acc[sentDate].push(`${NotificationStatusToText(n.status)} ${n.tile_title}`);
        return acc;
      }, {});

    const formatted = Object.entries(received)
      .map(([date, notifications]) => `${date}\r\n${notifications.join('\r\n')}`)
      .join('\r\n\r\n');

    const to_be_sent = Array.from(
      new Set(
        student_notifications
          .filter((n) => n.sent === null)
          .map((n) => `${NotificationStatusToText(n.status)} ${n.tile_title}`),
      ),
    ).join('\r\n');

    return {
      key: index.toString(),
      student,
      name: student.name,
      received: formatted,
      to_be_sent,
    };
  });
};

const NotificationCell = ({ notifications }: { notifications: string | undefined }): ReactElement => {
  const [showAll, setShowAll] = useState(false);
  if (!notifications) {
    return <>No notifications have been sent.</>;
  }

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
