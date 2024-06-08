import Notifications from '@/components/particles/notifications/notifications';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { BellOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Popover, Tooltip } from 'antd';
import { cn } from '@/utils/cn';
import { getStudentNotifications } from '@/api/users';
import { useQuery } from '@tanstack/react-query';
import { UserRoles, type User } from '@/types/user';
import { type TooltipPlacement } from 'antd/lib/tooltip';
import { useState, type FC, type ReactElement } from 'react';

interface Props {
  buttonClasses?: string;
  placement?: TooltipPlacement;
  user: User;
}
const NotificationPanel: FC<Props> = ({ buttonClasses, placement = 'leftTop', user }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
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
      overlayClassName='!bg-surface1 [&_div]:!bg-transparent [&>div]:before:!bg-surface1 [&>div>div>div]:!text-text'
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
      open={open}
      onOpenChange={(visible) => {
        if (user.role === UserRoles.student && visible) {
          trackEvent({
            userID: user.userID,
            action: ActionTypes.notifications,
            actionDetail: 'Opened Notifications',
            courseID: user.course_id,
          }).catch(() => {
            // Silently fail, since this is not critical
          });
        }
        setOpen(visible);
      }}
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
            'flex h-10 w-10 flex-col items-center justify-center border border-solid border-textAlt p-0 align-middle text-textAlt hover:!text-subtext1',
            buttonClasses,
          )}
          disabled={isLoading || isError}
          type='link'
        >
          {isLoading ?
            <LoadingOutlined className='text-textAlt [&>svg]:h-4 [&>svg]:w-4' />
          : isError ?
            <ExclamationOutlined className='text-textAlt [&>svg]:h-4 [&>svg]:w-4' />
          : <BellOutlined className='[&>svg]:h-4 [&>svg]:w-4' />}
        </Button>
      </Tooltip>
    </Popover>
  );
};

export default NotificationPanel;
