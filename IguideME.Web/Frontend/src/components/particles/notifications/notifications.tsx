import { RiseOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';
import { Card } from 'antd';
import { getStudentNotifications } from '@/api/users';
import { useQuery } from '@tanstack/react-query';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';

const Notifications: FC = (): ReactElement | null => {
  const { user } = useTileViewStore((state) => ({
    user: state.user,
  }));

  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`notifications/${user.userID}`],
    queryFn: async () => await getStudentNotifications(user.userID),
  });

  if (isLoading || isError || notifications === undefined) {
    return null;
  }

  // If there are no notifications, we don't want to render the card
  if (
    notifications.outperforming.length === 0 &&
    notifications.closing.length === 0 &&
    notifications.falling.length === 0 &&
    notifications.effort.length === 0
  ) {
    return null;
  }

  const styledNotifications = [
    notifications.outperforming.length > 0 && (
      <div key='outperforming'>
        <div className='flex gap-1'>
          <TrophyOutlined className='text-text' />
          <p className='text-text'>You are outperforming your peers in:</p>
        </div>
        <ul className='list-disc pl-9 text-sm'>
          {notifications.outperforming.map((notification) => (
            <li className='text-text' key={notification.tile_id}>
              {notification.tile_title}
            </li>
          ))}
        </ul>
      </div>
    ),

    notifications.closing.length > 0 && (
      <div key='closing'>
        <div className='flex gap-1'>
          <RiseOutlined className='text-text' />
          <p className='text-text'>You are closing the gap to your peers in:</p>
        </div>
        <ul className='list-disc pl-9 text-sm'>
          {notifications.closing.map((notification) => (
            <li className='text-text' key={notification.tile_id}>
              {notification.tile_title}
            </li>
          ))}
        </ul>
      </div>
    ),

    notifications.falling.length > 0 && (
      <div key='falling'>
        <div className='flex gap-1'>
          <WarningOutlined className='text-text' />
          <p className='text-text'>You are falling behind in:</p>
        </div>
        <ul className='list-disc pl-9 text-sm'>
          {notifications.falling.map((notification) => (
            <li className='text-text' key={notification.tile_id}>
              {notification.tile_title}
            </li>
          ))}
        </ul>
      </div>
    ),

    notifications.effort.length > 0 && (
      <div key='effort'>
        <div className='flex gap-1'>
          <WarningOutlined className='text-text' />
          <p className='text-text'>You have to put more effort in:</p>
        </div>
        <ul className='list-disc pl-9 text-sm'>
          {notifications.effort.map((notification) => (
            <li className='text-text' key={notification.tile_id}>
              {notification.tile_title}
            </li>
          ))}
        </ul>
      </div>
    ),
  ].filter(Boolean);

  return (
    <Card className='mb-4 w-full bg-surface1'>
      <Card.Meta
        title={
          <>
            <h3>Notifications</h3>
            <div className='my-2 h-px bg-text' />
          </>
        }
        description={
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {styledNotifications.map((item, index) => (
              <div key={index} className='bg-surface1'>
                {item}
              </div>
            ))}
          </div>
        }
      />
    </Card>
  );
};

export default Notifications;
