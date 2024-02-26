import { useContext, type FC, type ReactElement } from "react";
import { tileViewContext } from "@/components/pages/student-dashboard/context";

import "./style.scss";
import GraphTile from "@/components/crystals/graph-tile/graph-tile.tsx";
import GridTile from "@/components/crystals/grid-tile/grid-tile.tsx";
import { TileType, type Tile, GradingType } from "@/types/tile";
import { Col, Divider, Row } from "antd";
import PeerComparison from "@/components/particles/peer-comparison/peercomparison";
import { getTileGrades } from "@/api/tiles";
import { useQuery } from "react-query";
import Loading from "@/components/particles/loading";
import { getSelf } from "@/api/users";

interface Props {
  tile: Tile;
}

const ViewTile: FC<Props> = ({ tile }): ReactElement => {
  const viewType = useContext(tileViewContext);
  const { data: self } = useQuery("self", getSelf);
  const { data: grades } = useQuery(
    "tiles grades" + tile.id,
    async () =>
      await getTileGrades(self !== undefined ? self.userID : "-1", tile.id),
  );

  // const grade = Math.random() * 100;
  // const peerAvg = Math.random() * 100;
  // const peerMin = peerAvg / 2;
  // const peerMax = (100 + peerAvg) / 2;
  const max = 100;

  return (
    <div className="tileView">
      <Row justify={"center"} align={"middle"} style={{ height: "20%" }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 1400,
            fontFamily: '"Antic Slab", serif',
            lineHeight: "normal",
          }}
        >
          {tile.title}
        </h3>
      </Row>
      {renderViewType()}
    </div>
  );

  function renderViewType(): ReactElement {
    if (grades === undefined) {
      return <Loading />;
    }

    switch (viewType) {
      case "graph":
        return (
          <Row justify={"center"} align={"middle"} style={{ height: "80%" }}>
            <GraphTile
              type={tile.type}
              grades={{
                grade: grades.grade,
                peerAvg: grades.peerAvg,
                peerMin: grades.peerMin,
                peerMax: grades.peerMax,
                max,
                type: tile.gradingType,
              }}
            />
          </Row>
        );
      case "grid":
        return (
          <>
            <Row justify={"center"} align={"middle"} style={{ height: "50%" }}>
              <GridTile
                type={tile.type}
                grades={{
                  grade: grades.grade,
                  peerAvg: grades.peerAvg,
                  peerMin: grades.peerMin,
                  peerMax: grades.peerMax,
                  max,
                  type: tile.gradingType,
                }}
              />
            </Row>
            <Row justify={"center"} align={"top"} style={{ height: "30%" }}>
              <Col style={{ width: "100%" }}>
                <Divider style={{ margin: 0, padding: 0 }} />
                <PeerComparison
                  {...{
                    grade: grades.grade,
                    peerAvg: grades.peerAvg,
                    peerMin: grades.peerMin,
                    peerMax: grades.peerMax,
                    max,
                    type:
                      tile.type === TileType.assignments
                        ? tile.gradingType
                        : GradingType.NotGraded,
                  }}
                />
              </Col>{" "}
            </Row>
          </>
        );
    }
  }
};

export default ViewTile;
