import { Badge, Col, Row } from 'antd';
import { JobStatus } from '@/types/synchronization';
import { type FC, type ReactElement } from 'react';

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
    <div className="w-full h-full p-4 bg-primary-gray rounded-md shadow-statusCard   font-tnum">
      <Row className="justify-between">
        <Col>
          <h4 className="  font-tnum">{title}</h4>
        </Col>
        <Col>
          <span className="  font-tnum font-normal tracking-wider text-xs text-black">
            <Badge color={statusColors.get(status ?? JobStatus.Success)} text={status ?? JobStatus.Success} />
          </span>
        </Col>
      </Row>
      <Row>
        <span className="  font-tnum font-normal tracking-wider text-xs text-gray-600">{description}</span>
      </Row>
    </div>
  );
};

export default StatusCard;
