'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

export interface SyncTableType {
  startTimestamp: string;
  endTimestamp: string;
  duration: string;
  status: string;
}

export const columns: ColumnDef<SyncTableType>[] = [
  {
    accessorKey: 'startTimestamp',
    header: () => <div className='text-center'>Start timestamp</div>,
    cell: ({ row }) => {
      const startTimestamp = row.getValue('startTimestamp');
      return <div className='truncate text-left'>{startTimestamp as string}</div>;
    },
  },
  {
    accessorKey: 'endTimestamp',
    header: () => <div className='text-center'>End timestamp</div>,
    cell: ({ row }) => {
      const endTimestamp = row.getValue('endTimestamp');
      return <div className='truncate text-left'>{endTimestamp as string}</div>;
    },
  },
  {
    accessorKey: 'duration',
    header: () => <div className='text-center'>Duration</div>,
    cell: ({ row }) => {
      const duration = row.getValue('duration');
      return <div className='truncate text-left'>{duration as string}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-center'>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <div className='grid place-content-center'>
          <Badge
            className={status === 'COMPLETE' ? 'bg-success hover:bg-success' : 'bg-destructive hover:bg-destructive'}
          >
            {status === 'COMPLETE' ?
              'Success'
            : status === 'INCOMPLETE' ?
              'Failure'
            : (status as string)}
          </Badge>
        </div>
      );
    },
  },
];
