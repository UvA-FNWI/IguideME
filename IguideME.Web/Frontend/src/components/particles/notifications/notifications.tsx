import { RiseOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';
import { type Notifications as NotificationsType } from '@/types/notifications';

interface Props {
  notifications: NotificationsType;
}

const Notifications: FC<Props> = ({ notifications }): ReactElement => {
  const { outperforming, closing, falling, effort } = notifications;
  if (outperforming.length + closing.length + falling.length + effort.length === 0) {
    return (
      <div className='h-16 grid items-center'>
        <p>No notifications found</p>
      </div>
    );
  }

  return (
    <div>
      {outperforming.length > 0 && (
        <>
          <div className='flex gap-1'>
            <TrophyOutlined />
            <p className='text-text'>You are outperforming your peers in:</p>
          </div>
          <ul className='list-disc pl-9 text-sm'>
            {outperforming.map((notification) => (
              <li className='text-text' key={notification.tile_id}>
                {notification.tile_title}
              </li>
            ))}
          </ul>
        </>
      )}

      {closing.length > 0 && (
        <>
          <div className='flex gap-1'>
            <RiseOutlined />
            <p className='text-text'>You are closing the gap to your peers in:</p>
          </div>
          <ul className='list-disc pl-9 text-sm'>
            {closing.map((notification) => (
              <li className='text-text' key={notification.tile_id}>
                {notification.tile_title}
              </li>
            ))}
          </ul>
        </>
      )}

      {falling.length > 0 && (
        <>
          <div className='flex gap-1'>
            <WarningOutlined />
            <p className='text-text'>You are falling behind in:</p>
          </div>
          <ul className='list-disc pl-9 text-sm'>
            {falling.map((notification) => (
              <li className='text-text' key={notification.tile_id}>
                {notification.tile_title}
              </li>
            ))}
          </ul>
        </>
      )}
      {effort.length > 0 && (
        <>
          <div className='flex gap-1'>
            <WarningOutlined />
            <p className='text-text'>You have to put more effort in:</p>
          </div>
          <ul className='list-disc pl-9 text-sm'>
            {effort.map((notification) => (
              <li className='text-text' key={notification.tile_id}>
                {notification.tile_title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Notifications;
