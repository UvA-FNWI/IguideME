import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { pollSync } from '@/api/sync';
import { Card, CardContent } from '@/components/ui/card';
import type { JobModel } from '@/types/sync';
import { JobStatus, SyncStateNames, SyncStates } from '@/types/sync';

import { SyncStatusCard } from './sync-status-card';

export async function SyncProgressGrid(): Promise<ReactElement> {
  let isError = false;
  let syncPoll: JobModel[] | null = null;

  try {
    syncPoll = await pollSync();
  } catch {
    isError = true;
  }

  const statuses = new Map<string, JobStatus>();

  if (syncPoll) {
    const response = Object.values(syncPoll);
    if (response.length > 0) {
      const lastResponse = response[response.length - 1];
      if (lastResponse?.task) {
        const tmp = lastResponse.task.split(',');
        tmp.forEach((pair: string) => {
          const [task, status] = pair.split(':');
          if (task && status) {
            statuses.set(task, status as JobStatus);
          }
        });
      }
    }
  }

  return (
    <Card className='flex h-full min-w-80 flex-col items-center justify-center'>
      <CardContent className='flex flex-wrap items-center justify-center gap-2 !p-6'>
        {isError ?
          <div className='flex flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: synchronization progress could not be loaded</i>
          </div>
        : Object.values(SyncStateNames).map((name: string) => {
            const stateType = SyncStates.get(name);
            if (stateType === undefined) return null;

            let status: JobStatus = JobStatus.Unknown;
            if (statuses.has(name)) status = statuses.get(name) ?? JobStatus.Unknown;

            let description = '';
            switch (status) {
              case JobStatus.Processing:
                description = stateType.busy_text;
                break;
              case JobStatus.Success:
                description = stateType.finished_text;
                break;
              default:
                break;
            }

            return <SyncStatusCard description={description} key={name} status={status} title={stateType.title} />;
          })
        }
      </CardContent>
    </Card>
  );
}
