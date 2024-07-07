import { getStudentNotifications } from '@/api/users';
import Notifications from '@/components/particles/notifications/notifications';
import { UserRoles, type User } from '@/types/user';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';
import { BellOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Popover, Tooltip } from 'antd';
import { type TooltipPlacement } from 'antd/lib/tooltip';
import { memo, useState, type FC, type ReactElement } from 'react';

interface Props {
  buttonClasses?: string;
  placement?: TooltipPlacement;
  user: User | null;
}
const NotificationPanel: FC<Props> = memo(({ buttonClasses, placement = 'leftTop', user }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`notifications/${user ? user.userID : '-1'}`],
    queryFn: async () => await getStudentNotifications(user ? user.userID : '-1'),
    enabled: user !== null,
  });

  return (
    <Tooltip
      title={
        isLoading ? 'Loading notifications...'
        : isError ?
          'Error loading notifications'
        : ''
      }
      placement='right'
    >
      <Popover
        arrow={false}
        overlayClassName='custom-popover'
        content={
          user !== null ?
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
          if (user === null) return;

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
        <Button
          aria-disabled={isLoading || isError}
          aria-label={open ? 'Close Notifications' : 'Open Notifications'}
          className={cn(
            'flex h-10 w-10 flex-col items-center justify-center border border-solid border-textAlt p-0 align-middle text-textAlt hover:text-subtext1',
            buttonClasses,
          )}
          disabled={isLoading || isError}
          onClick={() => {
            setOpen(!open);
          }}
          type='link'
        >
          {isLoading ?
            <LoadingOutlined className='text-textAlt [&>svg]:h-4 [&>svg]:w-4' />
          : isError ?
            <ExclamationOutlined className='text-textAlt [&>svg]:h-4 [&>svg]:w-4' />
          : <BellOutlined className='[&>svg]:h-4 [&>svg]:w-4' />}
        </Button>
      </Popover>
    </Tooltip>
  );
});
NotificationPanel.displayName = 'NotificationPanel';
export default NotificationPanel;
