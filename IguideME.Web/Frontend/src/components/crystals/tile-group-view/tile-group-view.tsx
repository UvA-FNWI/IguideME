import { getGroupTiles } from "@/api/tiles";
import { type TileGroup } from "@/types/tile";
import { Col } from "antd";
import { type FC, type ReactElement } from "react";
import { useQuery } from "react-query";
import TileView from "../tile-view/tile-view";
import GroupView from "@/components/particles/group-view/group-view";

interface Props {
  group: TileGroup;
}
const ViewTileGroup: FC<Props> = ({ group }): ReactElement => {
  const { data: tiles } = useQuery(
    "tiles" + group.id,
    async () => await getGroupTiles(group.id),
  );
  return (
    <GroupView title={group.title}>
      {tiles?.map((tile) => (
        <Col key={tile.id}>
          <TileView tile={tile} />
        </Col>
      ))}
    </GroupView>
  );
};

export default ViewTileGroup;
