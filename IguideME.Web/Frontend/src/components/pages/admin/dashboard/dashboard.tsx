// /------------------------- Module imports -------------------------/
import { ConfigProvider, Divider, Spin, Table } from 'antd';
import { useQuery } from 'react-query';
import { FC, ReactElement } from 'react';

// /-------------------------- Own imports ---------------------------/
import { getSynchronizations } from '@/api/syncing';
import SyncManager from '@/components/crystals/syncmanager/syncmanager';
import { getRelativeTimeString, getRelativeTimeTimer } from '@/helpers/time';
import './style.scss';


const Dashboard: FC = (): ReactElement => {
  const {isLoading: loadingSyncs, data } = useQuery('syncs', getSynchronizations);

  const synchronizations = data?.sort((a, b) => b.start_timestamp - a.start_timestamp);

  // Get the date that the last successful sync was on.
  const latestSuccessful = synchronizations?.filter(a => a.status === "COMPLETE")[0];
  const format = new Intl.DateTimeFormat(navigator.language, {dateStyle: 'full', timeStyle: 'short'})
  const since = latestSuccessful ? getRelativeTimeString(latestSuccessful.start_timestamp) : "";

  const syncs = synchronizations?.map((s, i) => {
    const start = format.format(new Date(s.start_timestamp));
    if (s.end_timestamp === null) {
        return ({
            start_timestamp: start,
            end_timestamp: null,
            duration: null,
            status: s.status,
            key: i
        })
    }

    const end = format.format(new Date(s.end_timestamp));

    return ({
        start_timestamp: start,
        end_timestamp: end,
        duration: getRelativeTimeTimer(s.start_timestamp, s.end_timestamp),
        status: s.status,
        key: i
    })
})

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      {
        loadingSyncs ?
        <div><Spin /> Retrieving latest synchronization...</div>
        :
        (
          latestSuccessful ?
          <p>
              The latest successful synchronization took place on
              <b> {format.format(latestSuccessful.start_timestamp!)} </b>
                  <small>({since})</small>.
              Syncs run automatically at 03:00AM (UTC time).
          </p> :
          <p>No historic syncs available.</p>
        )
      }
      <Divider style={{ margin: '5px 0 20px 0' }} />

      <SyncManager />
      <h1 style={{ marginTop: 20 }}>Historic versions</h1>
      <Divider style={{ margin: '5px 0 20px 0' }} />
      <ConfigProvider theme={{
        components: {
          Table: {
            fontWeightStrong: 500,
            fontFamily: 'Maitree, serif'
          }
        }
      }}>
        <Table scroll={{ x: 240 }} dataSource={syncs} columns={columns}/>
      </ConfigProvider>
    </div>
  )
}

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
    render: (val: string, _: any) => <code>{val}</code>
}
]



export default Dashboard;
