import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import SyncManager from '@/components/crystals/syncmanager/syncmanager';
import { Divider, Table, type TableColumnsType } from 'antd';
import { getRelativeTimeString, getRelativeTimeTimer } from '@/helpers/time';
import { getSynchronizations } from '@/api/syncing';
import { useQuery } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

interface Sync {
  start_timestamp: number;
  end_timestamp: number | null;
  duration: [number, number] | null;
  status: string;
  key: number;
}

const Dashboard: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['syncs'],
    queryFn: getSynchronizations,
  });

  const synchronizations = data?.sort((a, b) => b.start_timestamp - a.start_timestamp);

  // Get the date that the last successful sync was on.
  const latestSuccessful = synchronizations?.filter((a) => a.status === 'COMPLETE')[0];
  const format = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'long', timeStyle: 'short' });
  const since = latestSuccessful !== undefined ? getRelativeTimeString(latestSuccessful.start_timestamp) : '';

  const syncs: Sync[] | undefined = synchronizations?.map((s, i) => {
    if (s.end_timestamp === null) {
      return {
        start_timestamp: s.start_timestamp,
        end_timestamp: null,
        duration: null,
        status: s.status,
        key: i,
      };
    }

    return {
      start_timestamp: s.start_timestamp,
      end_timestamp: s.end_timestamp,
      duration: [s.start_timestamp, s.end_timestamp],
      status: s.status,
      key: i,
    };
  });

  return (
    <>
      <AdminTitle
        title='Dashboard'
        description={
          isLoading ? 'Retrieving latest synchronization...'
          : isError ?
            'Failed to fetch synchronization data.'
          : latestSuccessful ?
            <>
              The latest successful synchronization took place on
              <b> {format.format(latestSuccessful.start_timestamp)} </b>
              <small>({since})</small>. Syncs run automatically at 03:00AM (UTC time).
            </>
          : <>No historic syncs available.</>
        }
      />

      <SyncManager />
      <h2 className='mt-5 text-xl'>Historic versions</h2>
      <Divider className='mb-5 mt-1' />
      <Table className='custom-table' dataSource={syncs} columns={columns} />
    </>
  );
};

const columns: TableColumnsType<Sync> = [
  {
    title: 'Start timestamp',
    dataIndex: 'start_timestamp',
    key: 'start_timestamp',
    sorter: (a, b) => a.start_timestamp - b.start_timestamp,
    render: (val: number) =>
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(val)),
  },
  {
    title: 'End timestamp',
    dataIndex: 'end_timestamp',
    key: 'end_timestamp',
    sorter: (a, b) => {
      if (a.end_timestamp === null || b.end_timestamp === null) return 0;
      return a.end_timestamp - b.end_timestamp;
    },
    render: (val: number | null) =>
      val ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(val)) : 'N/A',
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a, b) => {
      const aDuration = a.duration === null ? 0 : a.duration[1] - a.duration[0];
      const bDuration = b.duration === null ? 0 : b.duration[1] - b.duration[0];
      return aDuration - bDuration;
    },
    render: (val: [number, number] | null) => {
      if (val === null) return 'N/A';
      return getRelativeTimeTimer(val[0], val[1]);
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (val: string, _: any) => <code>{val}</code>,
    filters: [
      { text: 'COMPLETE', value: 'COMPLETE' },
      { text: 'FAILED', value: 'FAILED' },
    ],
    onFilter: (value, record) => record.status === value,
  },
];

export default Dashboard;
