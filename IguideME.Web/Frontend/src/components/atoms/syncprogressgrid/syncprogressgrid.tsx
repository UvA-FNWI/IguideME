import { pollSync } from '@/api/syncing';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import StatusCard from '@/components/particles/status-card/status-card';
import { JobStatus, SyncStateNames, SyncStates } from '@/types/synchronization';
import { useQuery } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import { useTheme } from 'next-themes';
import { useEffect, useState, type FC, type ReactElement } from 'react';

const SyncProgressGrid: FC = (): ReactElement => {
  const { theme } = useTheme();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['syncPoll'],
    queryFn: pollSync,
  });

  const [statuses, setStatuses] = useState<Map<string, JobStatus>>(new Map<string, JobStatus>());
  useEffect(() => {
    if (data !== undefined) {
      const newStatuses = new Map<string, JobStatus>();

      const response = Object.values(data);
      if (response.length > 0) {
        const tmp = response[response.length - 1].task.split(',');
        tmp.forEach((pair: string) => {
          const [task, status] = pair.split(':');
          newStatuses.set(task, status as JobStatus);
        });
      }

      setStatuses(newStatuses);
    }
  }, [data]);

  if (isError) {
    return (
      <div className={`h-full w-full rounded-lg p-[10px] ${theme === 'light' && 'shadow-statusCard'}`}>
        <QueryError className='grid place-content-center' title='Failed to fetch synchronization status' />
      </div>
    );
  } else {
    return (
      <div className={`h-full w-full rounded-lg bg-overlay0 p-[10px] ${theme === 'light' && 'shadow-statusCard'}`}>
        <Row gutter={[10, 10]}>
          {Object.values(SyncStateNames).map((name: string) => {
            const stateType = SyncStates.get(name);
            if (stateType === undefined) return '';

            let status: JobStatus = JobStatus.Unknown;
            if (statuses.has(name)) status = statuses.get(name) || JobStatus.Unknown;

            let description: string = '';
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

            return (
              <Col span={12} key={name}>
                <QueryLoading isLoading={isLoading}>
                  <StatusCard title={stateType.title} description={description} status={status} />
                </QueryLoading>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
};

export default SyncProgressGrid;
