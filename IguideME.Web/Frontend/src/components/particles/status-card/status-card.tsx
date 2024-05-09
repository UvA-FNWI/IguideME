import { JobStatus } from '@/types/synchronization';
import { Badge, Col, Row } from 'antd';
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
    <div
      className={`w-full h-full p-4 bg-card-foreground rounded-md ${theme === 'light' && 'shadow-statusCard'} font-tnum`}
    >
      <Row className='justify-between'>
        <Col>
          <h4 className='font-tnum'>{title}</h4>
        </Col>
        <Col>
          <span className='font-tnum font-normal tracking-wider text-xs text-text'>
            <Badge className='[&>span]:!text-text' color={statusColors.get(status)} text={status} />
          </span>
        </Col>
      </Row>
      <Row>
        <span className='font-tnum font-normal tracking-wider text-xs text-text/60'>{description}</span>
      </Row>
    </div>
  );
};

export default StatusCard;
