import SyncClock from '@/components/atoms/syncclock/syncclock';
import SyncProgressGrid from '@/components/atoms/syncprogressgrid/syncprogressgrid';
import { Alert, Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';

const SyncManager: FC = (): ReactElement => {
  const error = false;
  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={12} lg={9}>
        <SyncClock />
        {error && <Alert type='error' className='mt-5' message='Failed to reach datamart. Try again later!' />}
      </Col>

      <Col xs={24} md={12} lg={15}>
        <SyncProgressGrid />
      </Col>
    </Row>
  );
};

export default SyncManager;
