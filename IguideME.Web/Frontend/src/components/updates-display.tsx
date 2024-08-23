'use client';

import { type FC, memo, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { getNotifications } from '@/api/notification';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import type { Notifications, StudentNotification } from '@/types/notification';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

function UpdatesDisplay(): ReactElement {
  const { student } = useGlobalContext(useShallow((state) => ({ student: state.student })));
  const {
    data: notifications,
    isError,
    isLoading,
  } = useQuery({
    enabled: Boolean(student?.userID),
    queryKey: ['notifications', student?.userID],
    queryFn: () => getNotifications(student?.userID),
  });

  const notificationTypes = [
    { key: 'outperforming', icon: <Trophy size={30} />, message: 'You are outperforming your peers in:' },
    { key: 'closing', icon: <TrendingUp size={30} />, message: 'You are closing the gap to your peers in:' },
    { key: 'falling', icon: <TrendingDown size={30} />, message: 'You are falling behind in:' },
    { key: 'effort', icon: <CircleAlert size={30} />, message: 'You have to put more effort in:' },
  ];

  return (
    <div className='flex flex-wrap justify-center gap-4 md:justify-normal'>
      {notificationTypes.map(({ key, icon, message }) => {
        const notificationItems: StudentNotification[] = notifications ? notifications[key as keyof Notifications] : [];
        return (
          <UpdateSection
            key={key}
            icon={icon}
            isError={isError || !notifications}
            isLoading={isLoading}
            message={message}
            notifications={notificationItems}
          />
        );
      })}
    </div>
  );
}

interface UpdateSectionProps {
  icon: ReactElement;
  isError: boolean;
  isLoading: boolean;
  message: string;
  notifications: Notifications[keyof Notifications];
}

const UpdateSection: FC<UpdateSectionProps> = memo(
  ({ icon, isError, isLoading, message, notifications }): ReactElement | null => {
    return (
      <Card className='w-full min-w-64 max-w-80'>
        <CardHeader className='grid place-content-center border-b border-muted dark:border-foreground'>
          <CardTitle>{icon}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className='mb-6 mt-2 text-center text-sm italic text-muted-foreground'>{message}</h2>
          {isLoading ?
            <ul className='list-disc space-y-1'>
              <li>
                <Skeleton className='h-6 w-20' />
              </li>
              <li>
                <Skeleton className='h-6 w-16' />
              </li>
            </ul>
          : isError ?
            <p>Error: Failed to retrieved the updates for this type.</p>
          : notifications.length === 0 ?
            <p>No updates found for this type.</p>
          : <ul className='list-disc space-y-1'>
              {notifications.map((notification) => (
                <li key={notification.tile_id}>{notification.tile_title}</li>
              ))}
            </ul>
          }
        </CardContent>
      </Card>
    );
  },
);
UpdateSection.displayName = 'UpdateSection';

export { UpdatesDisplay };
