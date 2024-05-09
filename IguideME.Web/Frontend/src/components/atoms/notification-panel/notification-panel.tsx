import { getStudentNotifications } from '@/api/users';
import Notifications from '@/components/particles/notifications/notifications';
import { type User } from '@/types/user';
import { cn } from '@/utils/cn';
import { BellOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Popover, Tooltip } from 'antd';
import { type TooltipPlacement } from 'antd/lib/tooltip';
import { type FC, type ReactElement } from 'react';

interface Props {
  buttonClasses?: string;
  placement?: TooltipPlacement;
  user: User;
}
const NotificationPanel: FC<Props> = ({ buttonClasses, placement = 'leftTop', user }): ReactElement => {
  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`notifications/${user.userID}`],
    queryFn: async () => await getStudentNotifications(user.userID),
  });

  return (
    <Popover
      overlayClassName='!bg-dropdownBackground [&_div]:!bg-transparent [&>div]:before:!bg-dropdownBackground [&>div>div>div]:!text-text'
      content={
        user !== undefined ?
          notifications !== undefined ?
            <Notifications notifications={notifications} />
          : <div className='grid h-16 items-center'>
              <p>No notifications found</p>
            </div>

        : <div className='grid h-16 items-center'>
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
            'flex h-10 w-10 flex-col items-center justify-center border border-solid border-white p-0 align-middle text-white hover:!bg-navbar-light hover:!text-white',
            buttonClasses,
          )}
          disabled={isLoading || isError}
          type='link'
        >
          {isLoading ?
            <LoadingOutlined className='text-white [&>svg]:h-4 [&>svg]:w-4' />
          : isError ?
            <ExclamationOutlined className='text-white [&>svg]:h-4 [&>svg]:w-4' />
          : <BellOutlined className='[&>svg]:h-4 [&>svg]:w-4' />}
        </Button>
      </Tooltip>
    </Popover>
  );
};

export default NotificationPanel;
