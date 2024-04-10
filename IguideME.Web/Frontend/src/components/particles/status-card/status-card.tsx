import { Badge, Col, Row } from 'antd';
import { JobStatus } from '@/types/synchronization';
import { type FC, type ReactElement } from 'react';

interface Props {
  title: string;
  description: string;
  status: JobStatus;
}

const statusColors = new Map<string, string>([
  [JobStatus.Errored, 'red'],
  [JobStatus.Pending, 'orange'],
  [JobStatus.Processing, 'yellow'],
  [JobStatus.Success, 'green'],
  [JobStatus.Unknown, 'gray'],
]);

const StatusCard: FC<Props> = ({ title, description, status }): ReactElement => {
  return (
    <div className='w-full h-full p-4 bg-primary-gray rounded-md shadow-statusCard font-tnum'>
      <Row className='justify-between'>
        <Col>
          <h4 className='font-tnum'>{title}</h4>
        </Col>
        <Col>
          <span className='font-tnum font-normal tracking-wider text-xs text-black'>
            <Badge color={statusColors.get(status)} text={status} />
          </span>
        </Col>
      </Row>
      <Row>
        <span className='font-tnum font-normal tracking-wider text-xs text-gray-600'>{description}</span>
      </Row>
    </div>
  );
};

export default StatusCard;
