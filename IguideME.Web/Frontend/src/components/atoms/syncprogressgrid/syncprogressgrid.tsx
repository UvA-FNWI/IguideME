import { pollSync } from '@/api/syncing';
import { type FC, type ReactElement } from 'react';
import { useQuery } from 'react-query';
import './style.scss';
import { Col, Row } from 'antd';
import { type JobModel, JobStatus, SyncStateNames, SyncStates } from '@/types/synchronization';
import StatusCard from '@/components/particles/status-card/status-card';

const SyncProgressGrid: FC = (): ReactElement => {
	const { data } = useQuery('syncPoll', pollSync);
	const statuses = new Map<string, JobStatus>();

	if (data !== undefined) {
		Object.values(data).forEach((x: JobModel) => {
			statuses.set(x.task, x.status);
		});
	}

	return (
		<div className="SyncProgressGrid">
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
