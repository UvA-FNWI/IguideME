import { getCourseNotifications } from '@/api/users';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { type CourseNotification, type CourseNotificationDetail, NotificationStatus } from '@/types/notifications';
import { useQuery } from '@tanstack/react-query';
import { Select, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState, type FC, type ReactElement } from 'react';

interface DataType {
  key: string;
  student_name: string;
  received_notifications: string;
  to_be_sent_notifications: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Student Name',
    dataIndex: 'student_name',
    key: 'student_name',
  },
  {
    title: 'Received Notifications',
    dataIndex: 'received_notifications',
    key: 'received_notifications',
  },
  {
    title: 'To Be Sent Notifications',
    dataIndex: 'to_be_sent_notifications',
    key: 'to_be_sent_notifications',
  },
];

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
      return 'Unknown';
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

  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  const handleSelectChange = (value: number): void => {
    const filtered = Object.entries(notifications ?? {})
      .filter(([_, notification]) => (notification as CourseNotification).end_timestamp === value)
      .map(([key, notification]) => {
        const courseNotification = notification as CourseNotification;
        const received = courseNotification.notifications
          .filter((n: CourseNotificationDetail) => n.sent)
          .map((n: CourseNotificationDetail) => `${NotificationStatusToText(n.status)} ${n.tile_title}`)
          .join('\r\n');
        const toBeSent = courseNotification.notifications
          .filter((n: CourseNotificationDetail) => !n.sent)
          .map((n: CourseNotificationDetail) => `${NotificationStatusToText(n.status)} ${n.tile_title}`)
          .join('\r\n');

        return {
          key,
          student_name: courseNotification.student_name,
          received_notifications: received,
          to_be_sent_notifications: toBeSent,
        };
      });
    setFilteredData(filtered);
  };

  return (
    <>
      <AdminTitle title='Notification Centre' description='View all student notifications by synchronization' />
      {isError ?
        <QueryError className='relative' title='Failed to fetch notifications' />
      : <QueryLoading isLoading={isLoading}>
          <div className='space-y-5'>
            <Select className='w-full max-w-xs' placeholder='Select synchronization' onChange={handleSelectChange}>
              {Object.values(notifications ?? {}).map((notification: CourseNotification) => (
                <Select.Option key={notification.end_timestamp} value={notification.end_timestamp}>
                  {new Date(notification.end_timestamp * 1000).toLocaleString()}
                </Select.Option>
              ))}
            </Select>
            <Table className='custom-table [&_td]:whitespace-pre' columns={columns} dataSource={filteredData} />
          </div>
        </QueryLoading>
      }
    </>
  );
};

export default NotificationCentre;
