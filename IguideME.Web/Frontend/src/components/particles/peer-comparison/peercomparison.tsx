import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';
import { type Grades, printGrade } from '@/types/tile';

const PeerComparison: FC<Grades> = ({ peerAvg, peerMax, peerMin, max, type }): ReactElement => {
  return (
    <div className="text-neutral-500">
      <Row className="p-1 content-center justify-center">
        <Col>
          <span className="text-xs font-normal">Peer Comparison</span>
        </Col>
      </Row>
      <Row className="content-center justify-around">
        <Col className="text-center">
          <div>
            <small>min.</small>
          </div>
          <small>{printGrade(type, peerMin, max, false)}</small>
        </Col>
        <Col className="text-center">
          <div>
            <small>avg.</small>
          </div>
          <small>{printGrade(type, peerAvg, max, false)}</small>
        </Col>
        <Col className="text-center">
          <div>
            <small>max.</small>
          </div>
          <small>{printGrade(type, peerMax, max, false)}</small>
        </Col>
      </Row>
    </div>
  );
};

export default PeerComparison;
