import { getStudentNotifications } from '@/api/users';
import Notifications from '@/components/particles/notifications/notifications';
import { type User } from '@/types/user';
import { BellOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Popover, Tooltip } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  user: User | undefined;
}
const NotificationPanel: FC<Props> = ({ user }): ReactElement => {
  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: [`notifications/${user!.userID}`],
    queryFn: async () => await getStudentNotifications(user!.userID),
  });

  return (
    <div>
      <Popover
        content={
          user !== undefined ?
            notifications !== undefined ?
              <Notifications notifications={notifications} />
            : <div className='h-16 grid items-center'>
                <p>No notifications found</p>
              </div>

          : <div className='h-16 grid items-center'>
              <p>Please select a student</p>
            </div>
        }
        title='Notifications'
        trigger='click'
        placement='leftTop'
      >
        <Tooltip
          title={
            isLoading ? 'Loading notifications...'
            : isError ?
              'Error loading notifications'
            : ''
          }
          placement='bottom'
        >
          <Button
            aria-disabled={isLoading || isError}
            className='flex flex-col justify-center items-center h-10 border border-solid border-white align-middle text-white rounded-3xl w-10 p-0'
            disabled={isLoading || isError}
            type='link'
          >
            {isLoading ?
              <LoadingOutlined className='[&>svg]:w-4 [&>svg]:h-4 text-white' />
            : isError ?
              <ExclamationOutlined className='[&>svg]:w-4 [&>svg]:h-4 text-white' />
            : <BellOutlined className='[&>svg]:w-4 [&>svg]:h-4' />}
          </Button>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default NotificationPanel;
