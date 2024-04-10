// /------------------------- Module imports -------------------------/
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import SyncManager from '@/components/crystals/syncmanager/syncmanager';
import { Divider, Table } from 'antd';
import { getRelativeTimeString, getRelativeTimeTimer } from '@/helpers/time';
import { getSynchronizations } from '@/api/syncing';
import { useQuery } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

// /-------------------------- Own imports ---------------------------/

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

  const syncs = synchronizations?.map((s, i) => {
    const start = format.format(new Date(s.start_timestamp));
    if (s.end_timestamp === null) {
      return {
        start_timestamp: start,
        end_timestamp: null,
        duration: null,
        status: s.status,
        key: i,
      };
    }

    const end = format.format(new Date(s.end_timestamp));

    return {
      start_timestamp: start,
      end_timestamp: end,
      duration: getRelativeTimeTimer(s.start_timestamp, s.end_timestamp),
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
      <h1 className='mt-5'>Historic versions</h1>
      <Divider className='mt-1 mb-5' />
      <Table scroll={{ x: 240 }} dataSource={syncs} columns={columns} />
    </>
  );
};

const columns = [
  {
    title: 'Start timestamp',
    dataIndex: 'start_timestamp',
    key: 'start_timestamp',
  },
  {
    title: 'End timestamp',
    dataIndex: 'end_timestamp',
    key: 'end_timestamp',
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (val: string, _: any) => <code>{val}</code>,
  },
];

export default Dashboard;
