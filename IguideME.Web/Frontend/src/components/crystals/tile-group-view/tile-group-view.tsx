import { getGroupTiles } from "@/api/tiles";
import { type TileGroup } from "@/types/tile";
import { Row, Col } from "antd";
import { type FC, type ReactElement } from "react";
import { useQuery } from "react-query";
import TileView from "../tile-view/tile-view";
import "./syle.scss";
interface Props {
  group: TileGroup;
}
const ViewTileGroup: FC<Props> = ({ group }): ReactElement => {
  const { data: tiles } = useQuery(
    "tiles" + group.id,
    async () => await getGroupTiles(group.id),
  );
  return (
    <div className="tileGroupView">
      <div style={{ margin: 12 }}>
        <h2>{group.title}</h2>
      </div>
      <Row
        justify="space-evenly"
        gutter={[10, 78]}
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        {tiles?.map((tile) => (
          <Col key={tile.id}>
            <TileView tile={tile} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewTileGroup;
