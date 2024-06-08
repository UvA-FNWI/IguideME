import { Badge, Col, Row } from 'antd';
import { JobStatus } from '@/types/synchronization';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();

  return (
    <div className={`h-full w-full rounded-md bg-base p-4 ${theme === 'light' && 'shadow-statusCard'} font-tnum`}>
      <Row className='justify-between'>
        <Col>
          <h4 className='font-tnum'>{title}</h4>
        </Col>
        <Col>
          <span className='font-tnum text-xs font-normal tracking-wider text-text'>
            <Badge className='[&>span]:!text-text' color={statusColors.get(status)} text={status} />
          </span>
        </Col>
      </Row>
      <Row>
        <span className='font-tnum text-xs font-normal tracking-wider text-text/60'>{description}</span>
      </Row>
    </div>
  );
};

export default StatusCard;
