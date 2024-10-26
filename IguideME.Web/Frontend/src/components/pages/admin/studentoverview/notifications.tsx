import { type NotificationMap, NotificationStatus } from '@/types/notifications';
import { Button, type TableColumnsType } from 'antd';
import { useState, type ReactElement } from 'react';
import { type CommonData } from './common-table';
import { type User } from '@/types/user';

export interface NotificationData {
  received?: string;
  toBeSent?: string;
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
      dataIndex: 'toBeSent',
      key: 'toBeSent',
      width: '40%',
    },
  ];
};

export const getNotificationData = (
  students: User[],
  notifications: NotificationMap | undefined,
): Array<CommonData & NotificationData> => {
  console.log('students', students);
  return students.map((student, index) => {
    const studentNotifications = notifications?.[student.userID];
    if (!studentNotifications) {
      return { student, name: student.name, key: index.toString() };
    }

    const received = studentNotifications
      ?.filter((n) => n.sent !== null)
      // @ts-expect-error: TS18047 -- All null elements have been filtered out
      .sort((a, b) => b.sent - a.sent)
      .reduce<Record<string, string[]>>((acc, n) => {
        // @ts-expect-error: TS18047 -- All null elements have been filtered out
        const sentDate = new Date(n.sent).toLocaleDateString();
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!acc[sentDate]) acc[sentDate] = [];
        acc[sentDate].push(`${NotificationStatusToText(n.status)} ${n.tile_title}`);
        return acc;
      }, {});

    const formatted = Object.entries(received)
      .map(([date, notifications]) => `${date}\r\n${notifications.join('\r\n')}`)
      .join('\r\n\r\n');

    const toBeSent = Array.from(
      new Set(
        studentNotifications
          .filter((n) => n.sent === null)
          .map((n) => `${NotificationStatusToText(n.status)} ${n.tile_title}`),
      ),
    ).join('\r\n');

    return {
      key: index.toString(),
      student,
      name: student.name,
      received: formatted,
      toBeSent,
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
