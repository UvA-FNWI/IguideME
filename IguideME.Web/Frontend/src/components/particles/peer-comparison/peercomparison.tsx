import { type FC, type ReactElement } from "react";
import { type Grades, printGrade } from "@/types/tile";
import { Col, Row } from "antd";

const PeerComparison: FC<Grades> = ({
  peerAvg,
  peerMax,
  peerMin,
  max,
  type,
}): ReactElement => {
  return (
    <div className='text-neutral-500'>
      <Row
        align="middle"
        className='pt-1'
        justify="center"
      >
        <Col>
          <span
            className='text-xs font-normal'>Peer Comparison</span>
        </Col>
      </Row>
      <Row
        align="middle"
        justify="space-around"
      >
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
