import Notifications from '@/components/particles/notifications/notifications';
import { BellOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Popover, Tooltip } from 'antd';
import { cn } from '@/utils/cn';
import { getStudentNotifications } from '@/api/users';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { useQuery } from '@tanstack/react-query';
import { type User } from '@/types/user';
import { type FC, type ReactElement } from 'react';

interface Props {
  buttonClasses?: string;
  placement?: TooltipPlacement;
  user: User | undefined;
}
const NotificationPanel: FC<Props> = ({ buttonClasses, placement = 'leftTop', user }): ReactElement => {
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
      placement={placement}
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
          className={cn(
            'flex flex-col justify-center items-center h-10 border border-solid border-white align-middle text-white rounded-3xl w-10 p-0',
            buttonClasses,
          )}
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
  );
};

export default NotificationPanel;
