import { useContext, type FC, type ReactElement } from "react";
import { tileViewContext } from "@/components/pages/student-dashboard/context";
import { Tile, TileType } from "@/types/tile";

import "./style.scss";
import { ResponsiveBar } from "@nivo/bar";

interface Props {
  tile: Tile;
}
const ViewTile: FC<Props> = ({ tile }): ReactElement => {
  const viewType = useContext(tileViewContext);
  return (
    <div className="tileView">
      <div style={{ margin: 12 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 1400,
            fontFamily: '"Antic Slab", serif',
          }}
        >
          {tile.title}
        </h3>
      </div>
      {renderViewType()}
    </div>
  );
  function renderViewType() {
    switch (viewType) {
      case "graph":
        return <GraphTile tile={tile} />;
      case "grid":
        return <GridTile tile={tile} />;
    }
  }
};

const GraphTile: FC<Props> = ({ tile }): ReactElement => {
  switch (tile.type) {
    case TileType.assignments:
    case TileType.discussions:
      return <GraphGrade tile={tile} />;
    case TileType.learning_outcomes:
      return <GraphLearning tile={tile} />;
  }
  return <>{tile.entries.map((e) => e.title)}</>;
};

const GridTile: FC<Props> = ({ tile }): ReactElement => {
  return <>grid</>;
};

const GraphGrade: FC<Props> = ({ tile }): ReactElement => {
  const grade = Math.random() * 100;
  const peeravg = Math.random() * 100;
  const peermin = peeravg / 2;
  const peermax = 100 - peeravg / 2;
  return (
    <div style={{ height: "80%", width: "100% " }}>
      <ResponsiveBar
        data={[
          {
            key: "You",
            tooltipName: "You",
            grade: grade,
            color: "rgba(90, 50, 255, .9)",
            borderColor: "rgba(50, 10, 215, 1)",
          },
          {
            key: "Peer",
            tooltipName: "Peers",
            grade: peeravg,
            color: "rgba(255, 50, 50, .5)",
            borderColor: "rgba(255,0,0, 1)",
          },
        ]}
        label={""}
        enableGridY={false}
        indexBy="key"
        tooltip={(d) => (
          <div
            style={{
              background: "rgba(255,255,255,.95)",
              padding: 5,
              border: "1px solid #ebebeb",
            }}
          >
            {d.data.tooltipName}: <b>{d.value.toFixed(1)}</b>
          </div>
        )}
        keys={["grade"]}
        axisLeft={null}
        minValue={0}
        margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
        maxValue={100}
        axisBottom={null}
        padding={0.2}
        borderWidth={1}
        borderColor={({ data }) => data.data.borderColor}
        colors={({ data }) => data.color}
        colorBy="indexValue"
      />
    </div>
  );
};

const GraphLearning: FC<Props> = ({ tile }): ReactElement => {
  return <div></div>;
};

export default ViewTile;
