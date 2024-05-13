import SyncClock from '@/components/atoms/syncclock/syncclock';
import SyncProgressGrid from '@/components/atoms/syncprogressgrid/syncprogressgrid';
import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';

const SyncManager: FC = (): ReactElement => {
  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={12} lg={9}>
        <SyncClock />
      </Col>

      <Col xs={24} md={12} lg={15}>
        <SyncProgressGrid />
      </Col>
    </Row>
  );
};

export default SyncManager;
