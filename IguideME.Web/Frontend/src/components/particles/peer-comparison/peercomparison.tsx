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
    <div style={{ color: "#7c7c7c" }}>
      <Row justify={"center"} align={"middle"} style={{ paddingTop: 4 }}>
        <Col>
          <span style={{ fontSize: 12, fontWeight: 450 }}>Peer Comparison</span>
        </Col>
      </Row>
      <Row justify={"space-around"} align={"middle"}>
        <Col style={{ textAlign: "center" }}>
          <div>
            <small>min.</small>
          </div>
          <small>{printGrade(type, peerMin, max, false)}</small>
        </Col>
        <Col style={{ textAlign: "center" }}>
          <div>
            <small>avg.</small>
          </div>
          <small>{printGrade(type, peerAvg, max, false)}</small>
        </Col>
        <Col style={{ textAlign: "center" }}>
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
