'use client';

import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDuration, intervalToDuration } from 'date-fns';

import { pollSync, startNewSync, stopCurrentSync } from '@/api/sync';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/cn';
import { JobStatus } from '@/types/sync';

import styles from './sync-clock.module.css';

export function SyncClock(): ReactElement {
  const [elapsed, setElapsed] = useState<string | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (startTime !== null) {
      const intervalId = setInterval(() => {
        const duration = intervalToDuration({ start: new Date(startTime), end: new Date() });
        setElapsed(formatDuration(duration));
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [startTime]);

  const { mutate: initiateSync } = useMutation({
    mutationFn: startNewSync,
  });

  const { mutate: abortSync } = useMutation({
    mutationFn: stopCurrentSync,
  });

  const { data, isError } = useQuery({
    queryKey: ['syncPoll'],
    queryFn: pollSync,
    refetchInterval: !elapsed ? false : 100,
  });

  useEffect(() => {
    if (data !== undefined) {
      const done =
        !data?.some((job) => job.status !== JobStatus.Success) || data.some((job) => job.status === JobStatus.Errored);
      if (done) {
        setStartTime(null);
        // This marks everything for a refetch from the backend.
        void queryClient.invalidateQueries();
      }
    }
  }, [data, queryClient, setStartTime]);

  const startSync = useCallback(() => {
    initiateSync();
    setStartTime(Date.now());
  }, [initiateSync]);

  const stopSync = useCallback(() => {
    abortSync();
    setElapsed(undefined);
    setStartTime(null);
  }, [abortSync]);

  const { toast } = useToast();
  useEffect(() => {
    if (isError) {
      stopSync();
      toast({
        title: 'Failed to fetch synchronization status',
        variant: 'destructive',
      });
    }
  }, [isError, stopSync, toast]);

  return (
    <>
      <Card className='flex h-full min-w-80 flex-col items-center justify-center'>
        <CardContent className='grid place-content-center !p-6'>
          <div
            className={cn(
              `bg-base flex h-[180px] w-[180px] items-center justify-center rounded-full text-center shadow-sm ${
                elapsed ? 'before:animate-spin' : ''
              }`,
              styles.syncClock,
            )}
          >
            <div className='border-none'>
              <span>
                <h3>
                  <small>elapsed time</small>
                </h3>
              </span>
              <span>
                <h3>{elapsed ?? 'Idle'}</h3>
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex w-full items-center justify-center gap-2'>
          <Button className='w-32' disabled={Boolean(elapsed)} onClick={startSync}>
            Synchronize
          </Button>

          <Button
            className='w-32'
            disabled={!elapsed}
            onClick={() => {
              setOpenDialog(true);
            }}
            variant='destructive'
          >
            Abort
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to abort the synchronization?</AlertDialogTitle>
            <AlertDialogDescription>This will undo the updates from the current sync!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                stopSync();
                setOpenDialog(false);
                toast({
                  title: 'Synchronization aborted!',
                  description: 'The synchronization has stopped and the most recent data will be used instead.',
                  variant: 'destructive',
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
