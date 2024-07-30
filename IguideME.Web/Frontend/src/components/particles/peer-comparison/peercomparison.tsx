import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';
import { printGrade, type Grades } from '@/types/grades';

const PeerComparison: FC<{ grades: Grades }> = ({ grades: { peerAvg, peerMax, peerMin, max, type } }): ReactElement => {
  return (
    <div className='text-subtext0'>
      <Row className='content-center justify-center pt-1'>
        <Col>
          <span className='text-xs font-semibold'>Peer Comparison</span>
        </Col>
      </Row>
      <Row className='content-center justify-around pt-1'>
        <Col className='text-center'>
          <p className='text-xs'>
            min.
            <br />
            {printGrade(type, peerMin, max, false)}
          </p>
        </Col>
        <Col className='text-center'>
          <p className='text-xs'>
            avg.
            <br />
            {printGrade(type, peerAvg, max, false)}
          </p>
        </Col>
        <Col className='text-center'>
          <p className='text-xs'>
            max.
            <br />
            {printGrade(type, peerMax, max, false)}
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default PeerComparison;
