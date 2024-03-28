import styles from './syncclock.module.css';
import Swal from 'sweetalert2';
import { Button, Col, Row } from 'antd';
import { cn } from '@/utils/cn';
import { getRelativeTimeTimer } from '@/helpers/time';
import { JobStatus } from '@/types/synchronization';
import { pollSync, startNewSync, stopCurrentSync } from '@/api/syncing';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { type FC, type ReactElement, useEffect, useState } from 'react';

const SyncClock: FC = (): ReactElement => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const queryClient = useQueryClient();

  let elapsed;
  if (startTime !== null) {
    elapsed = getRelativeTimeTimer(startTime, Date.now());
  }

  // const elapsed = null;
  const { mutate: initiateSync } = useMutation(startNewSync);
  const { mutate: abortSync } = useMutation(stopCurrentSync);
  const { data } = useQuery('syncPoll', pollSync, {
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

  return (
    <>
      <Row className="mb-5 justify-center" gutter={10}>
        <Col>
          <div
            className={cn(
              `w-[180px] h-[180px] rounded-full bg-primary-gray flex justify-center items-center text-center shadow-syncClock ${
                elapsed !== undefined ? 'before:animate-spin' : ''
              }`,
              styles.syncClock,
            )}
          >
            <div className="border-none">
              <span>
                <h3>
                  <small className="  font-tnum">elapsed time</small>
                </h3>
              </span>
              <span>
                <h3 className="  font-tnum">{elapsed ?? 'Idle'}</h3>
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col xs={12}>
          <Button
            block
            className="text-emerald-500 hover:!text-emerald-500 uppercase bg-primary-gray hover:!bg-primary-gray shadow-syncButton border-none rounded-[4px] m-[10px] hover:enabled:shadow-statusCard disabled:bg-primary-disabled disabled:hover:!text-black/25 disabled:hover:!bg-primary-disabled disabled:shadow-statusCard"
            disabled={elapsed !== undefined}
            onClick={startSync}
          >
            synchronize
          </Button>
        </Col>

        <Col xs={12}>
          <Button
            className="text-emerald-500 hover:!text-emerald-500 uppercase bg-primary-gray hover:!bg-primary-gray shadow-syncButton border-none rounded-[4px] m-[10px] hover:enabled:shadow-statusCard disabled:bg-primary-disabled disabled:hover:!text-black/25 disabled:hover:!bg-primary-disabled disabled:shadow-statusCard"
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
        </Col>
      </Row>
    </>
  );
};

export default SyncClock;
