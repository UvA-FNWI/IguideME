import styles from './syncclock.module.css';
import Swal from 'sweetalert2';
import { App, Button } from 'antd';
import { cn } from '@/utils/cn';
import { getRelativeTimeTimer } from '@/helpers/time';
import { JobStatus } from '@/types/synchronization';
import { pollSync, startNewSync, stopCurrentSync } from '@/api/syncing';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { type FC, type ReactElement, useEffect, useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';

const SyncClock: FC = (): ReactElement => {
  const { theme } = useTheme();

  const [startTime, setStartTime] = useState<number | null>(null);
  const queryClient = useQueryClient();

  let elapsed;
  if (startTime !== null) {
    elapsed = getRelativeTimeTimer(startTime, Date.now());
  }

  const { notification } = App.useApp();
  const { mutate: initiateSync } = useMutation({
    mutationFn: startNewSync,

    onMutate: () => {
      notification.open({
        key: 'sync',
        message: 'Synchronization started',
        description: 'Please wait while the synchronization is in progress. IguideME is unusable during this time.',
        icon: <WarningOutlined className='text-orange-500' />,
        placement: 'top',
        showProgress: true,
        duration: 10,
      });
    },
  });

  const { mutate: abortSync } = useMutation({
    mutationFn: stopCurrentSync,

    onSuccess: () => {
      notification.destroy('sync');
    },
  });

  const { data, isError } = useQuery({
    queryKey: ['syncPoll'],
    queryFn: pollSync,
    refetchInterval: elapsed === undefined ? false : 100,
  });

  useEffect(() => {
    if (data !== undefined) {
      const done =
        !data.some((job) => job.status !== JobStatus.Success) || data.some((job) => job.status === JobStatus.Errored);
      if (done) {
        setStartTime(null);
        // This marks everything for a refetch from the backend.
        void queryClient.invalidateQueries();
      }
    }
  }, [data, setStartTime]);

  const startSync = (): void => {
    initiateSync();
    setStartTime(Date.now());
  };

  const stopSync = (): void => {
    abortSync();
    setStartTime(null);
  };

  useEffect(() => {
    if (isError) {
      stopSync();
      void Swal.fire({
        title: 'Failed to fetch synchronization status',
        icon: 'error',
      });
    }
  }, [isError]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid w-full place-content-center'>
        <div
          className={cn(
            `flex h-[180px] w-[180px] items-center justify-center rounded-full bg-base text-center ${theme === 'light' && 'shadow-syncClock'} ${
              elapsed !== undefined ? 'before:animate-spin' : ''
            }`,
            styles.syncClock,
          )}
        >
          <div className='border-none'>
            <span>
              <h3>
                <small className='font-tnum'>elapsed time</small>
              </h3>
            </span>
            <span>
              <h3 className='font-tnum'>{elapsed ?? 'Idle'}</h3>
            </span>
          </div>
        </div>
      </div>

      <div className='flex justify-between gap-2'>
        <Button
          block
          className={`m-0 flex-grow basis-0 bg-overlay1 uppercase text-text hover:!bg-overlay2 hover:!text-text ${theme === 'light' && 'shadow-syncButton hover:enabled:shadow-statusCard disabled:shadow-statusCard'} rounded-sm border-none disabled:bg-surface2 disabled:!text-text disabled:hover:!bg-surface2 disabled:hover:!text-text`}
          disabled={elapsed !== undefined}
          onClick={startSync}
        >
          synchronize
        </Button>

        <Button
          className={`m-0 flex-grow basis-0 bg-overlay1 uppercase text-text hover:!bg-overlay2 hover:!text-text ${theme === 'light' && 'shadow-syncButton hover:enabled:shadow-statusCard disabled:shadow-statusCard'} rounded-sm border-none disabled:bg-surface2 disabled:!text-text disabled:hover:!bg-surface2 disabled:hover:!text-text`}
          disabled={elapsed === undefined}
          block
          onClick={() => {
            void Swal.fire({
              title: 'Do you really want to abort the synchronization?',
              text: `This will undo the updates from the current sync!`,
              icon: 'warning',
              focusCancel: true,
              showCancelButton: true,
              confirmButtonText: 'Abort',
              cancelButtonText: 'Cancel',
              customClass: {},
            }).then((result) => {
              if (result.isConfirmed) {
                stopSync();
                void Swal.fire(
                  'Synchronization aborted!',
                  'The synchronization has stopped and the most recent data will be used instead.',
                  'error',
                );
              }
            });
          }}
        >
          abort
        </Button>
      </div>
    </div>
  );
};

export default SyncClock;
