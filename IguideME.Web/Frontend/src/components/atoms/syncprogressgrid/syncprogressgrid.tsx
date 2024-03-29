import StatusCard from '@/components/particles/status-card/status-card';
import { Col, Row } from 'antd';
import { JobStatus, SyncStateNames, SyncStates } from '@/types/synchronization';
import { pollSync } from '@/api/syncing';
import { useQuery } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

const SyncProgressGrid: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['syncPoll'],
    queryFn: pollSync,
  });

  const statuses = new Map<string, JobStatus>();

  if (data !== undefined) {
    const response = Object.values(data);
    if (response.length > 0) {
      const tmp = response[response.length - 1].task.split(',');
      tmp.forEach((pair: string) => {
        const [task, status] = pair.split(':');
        statuses.set(task, status as JobStatus);
      });
    }
  }

  return (
    <div className="w-full h-full p-[10px] rounded-lg shadow-statusCard">
      <Row gutter={[10, 10]}>
        {Object.values(SyncStateNames).map((name: string) => {
          const stateType = SyncStates.get(name);
          if (stateType === undefined) {
            return '';
          }
          const status = statuses.get(name);
          const description = status === JobStatus.Processing ? stateType.busy_text : stateType.finished_text;

          return (
            <Col span={12} key={name}>
              <StatusCard title={stateType.title} description={description} status={status} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SyncProgressGrid;
