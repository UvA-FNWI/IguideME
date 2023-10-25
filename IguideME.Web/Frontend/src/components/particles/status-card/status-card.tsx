import { type FC, type ReactElement } from 'react';

import './style.scss';
import { Badge, Col, Row } from 'antd';
import { JobStatus } from '@/types/synchronization';
import { type LiteralUnion } from 'antd/es/_util/type';

interface Props {
	title: string | undefined;
	description: string | undefined;
	status: JobStatus | undefined;
}

const statusColors = new Map<string, LiteralUnion<'red' | 'orange' | 'yellow' | 'green'>>([
	[JobStatus.Errored, 'red'],
	[JobStatus.Pending, 'orange'],
	[JobStatus.Processing, 'yellow'],
	[JobStatus.Success, 'green'],
]);

const StatusCard: FC<Props> = ({ title, description, status }): ReactElement => {
	return (
		<div className="card">
			<Row justify="space-between">
				<Col>
					<h4>{title}</h4>
				</Col>
				<Col>
					<span>
						<Badge color={statusColors.get(status ?? JobStatus.Success)} text={status ?? JobStatus.Success} />
					</span>
				</Col>
			</Row>
			<Row>
				<span>{description}</span>
			</Row>
		</div>
	);
};

export default StatusCard;
