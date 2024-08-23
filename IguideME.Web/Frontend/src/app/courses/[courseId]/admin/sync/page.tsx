import type { ReactElement } from 'react';
import { formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';

import { getSynchronizations } from '@/api/sync';
import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';
import type { Synchronization } from '@/types/sync';

import { SyncClock } from './_components/sync-clock/sync-clock';
import { SyncProgressGrid } from './_components/sync-progress-grid';
import { columns, type SyncTableType } from './_components/sync-table/columns';
import { DataTable } from './_components/sync-table/data-table';

export default async function AdminSync(): Promise<ReactElement> {
  let isError = false;
  let dbSynchronizations: Synchronization[] = [];

  try {
    dbSynchronizations = await getSynchronizations();
  } catch {
    isError = true;
  }

  const synchronizations = dbSynchronizations.sort((a, b) => b.start_timestamp - a.start_timestamp);

  // Get the date that the last successful sync was on.
  const latestSuccessful = synchronizations.filter((a) => a.status === 'COMPLETE')[0];
  const format = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    hourCycle: 'h23',
    timeZone: 'Europe/Amsterdam',
  });
  const since =
    latestSuccessful ? formatDistanceToNow(new Date(latestSuccessful.start_timestamp), { addSuffix: true }) : null;

  const syncs: SyncTableType[] = synchronizations.map((s) => {
    const start = format.format(new Date(s.start_timestamp));
    if (s.end_timestamp === null) {
      return {
        startTimestamp: start,
        endTimestamp: '',
        duration: '',
        status: s.status,
      };
    }

    const end = new Date(s.end_timestamp).toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
      hourCycle: 'h23',
      timeZone: 'Europe/Amsterdam',
    });

    return {
      startTimestamp: start,
      endTimestamp: end,
      duration: formatDuration(
        intervalToDuration({ start: new Date(s.start_timestamp), end: new Date(s.end_timestamp) }),
      ),
      status: s.status,
    };
  });

  return (
    <>
      <AdminHeader
        title='Dashboard'
        subtitle={
          isError ? 'Failed to fetch synchronization data.'
          : latestSuccessful && since ?
            <>
              The latest successful synchronization took place on
              <b> {format.format(latestSuccessful.start_timestamp)} </b>
              <small>({since})</small>. Syncs run automatically at 03:00AM (UTC time).
            </>
          : <>No historic syncs available.</>
        }
      />

      <div className='mb-8 flex w-full flex-wrap gap-8'>
        <div className='flex-1 flex-grow'>
          <SyncClock />
        </div>
        <div className='flex-1 flex-grow'>
          <SyncProgressGrid />
        </div>
      </div>
      <h2 className='mb-4 mt-8 text-xl'>Historic versions</h2>
      <DataTable columns={columns} data={syncs} isError={isError} />
    </>
  );
}
