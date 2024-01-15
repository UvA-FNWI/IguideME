import { useContext, type FC, type ReactElement } from "react";
import { tileViewContext } from "@/components/pages/student-dashboard/context";
import { type Tile, TileType } from "@/types/tile";

import "./style.scss";
import { Bullet, BulletConfig, RadialBar } from "@ant-design/charts";
import { Col, Row } from "antd";

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
  function renderViewType(): ReactElement {
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
  return <>{tile.title}</>;
};

const GraphGrade: FC<Props> = ({ tile }): ReactElement => {
  const grade = Math.random() * 100;
  const peeravg = Math.random() * 100;
  const peermin = peeravg / 2;
  const peermax = (100 + peeravg) / 2;
  const max = 100;

  const studentdata = [
    {
      title: "You",
      Grade: grade,
      Max: max,
    },
  ];
  const peerdata = [
    {
      title: "Peers",
      Grade: peeravg,
      ranges: [peermin, peermax, max],
    },
  ];

  const config = {
    layout: "vertical",
    padding: 10,
    paddingBottom: 20,
    paddingTop: 0,
    marginTop: 5,
    axis: {
      y: { label: false, tick: false, grid: false },
    },
    tooltip: {
      title: "",
      items: [
        {
          channel: "y",

          valueFormatter: ".2f",
        },
      ],
    },
    range: {
      style: {
        maxWidth: 60,
      },
    },
    measure: {
      style: {
        maxWidth: 40,
      },
    },
    target: {
      sizeField: 30,
    },
    legend: { color: { position: "bottom" } },
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col span={12} style={{ height: "90%" }}>
        <Bullet
          data={studentdata}
          rangeField="Max"
          measureField="Grade"
          color={{
            Max: ["#f6f8fa"],
            Grade: "rgb(90, 50, 255)",
          }}
          {...config}
        />
      </Col>
      <Col span={12} style={{ height: "90%" }}>
        <Bullet
          data={peerdata}
          measureField="Grade"
          color={{
            ranges: ["#f6f8fa", "rgba(255, 50, 50, .3)", "#f6f8fb"],
            Grade: "rgb(255, 50, 50)",
          }}
          {...config}
          mapField={{
            measures: "Grade",
            ranges: ["Max", "Peer max", "Peer min"],
            target: "",
          }}
        />
      </Col>{" "}
    </Row>
  );
};

const GraphLearning: FC<Props> = ({ tile }): ReactElement => {
  const grade = Math.random() * 100;
  const peeravg = Math.random() * 100;
  const peermin = peeravg / 2;
  const peermax = (100 + peeravg) / 2;
  const max = 100;

  const data = [
    {
      name: "You",
      Grade: grade,
    },
    {
      name: "Peer",
      Grade: peeravg,
    },
  ];
  const config = {
    data,
    padding: 0,
    margin: 0,
    paddingBottom: 10,
    xField: "name",
    yField: "Grade",
    maxAngle: 360,
    radius: 1.3,
    innerRadius: 0.3,
    scale: {
      y: {
        domain: [0, 100],
      },
    },
    style: {
      fill: (data: any) => {
        if (data.name === "You") {
          return "rgb(90, 50, 255 )";
        }
        return "rgb(255, 50, 50)";
      },
    },
    axis: {
      y: { label: false, tick: false, grid: false },
    },
    tooltip: {
      title: "",
      items: [
        {
          name: "Completed",
          field: "Grade",
          valueFormatter: (d: number) => d.toFixed(0) + "/" + max,
        },
      ],
    },
  };
  return (
    <div style={{ height: "90%", margin: 0 }}>
      <RadialBar {...config} />
    </div>
  );
};

export default ViewTile;

// <ResponsiveBar
//         data={[
//           {
//             key: "You",
//             tooltipName: "You",
//             grade: grade,
//             color: "rgba(90, 50, 255, .9)",
//             borderColor: "rgba(50, 10, 215, 1)",
//           },
//           {
//             key: "Peer",
//             tooltipName: "Peers",
//             grade: peeravg,
//             color: "rgba(255, 50, 50, .5)",
//             borderColor: "rgba(255,0,0, 1)",
//           },
//         ]}
//         label={""}
//         enableGridY={false}
//         indexBy="key"
//         tooltip={(d) => (
//           <div
//             style={{
//               background: "rgba(255,255,255,.95)",
//               padding: 5,
//               border: "1px solid #ebebeb",
//             }}
//           >
//             {d.data.tooltipName}: <b>{d.value.toFixed(1)}</b>
//           </div>
//         )}
//         keys={["grade"]}
//         axisLeft={null}
//         minValue={0}
//         margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
//         maxValue={100}
//         axisBottom={null}
//         padding={0.2}
//         borderWidth={1}
//         borderColor={({ data }) => data.data.borderColor}
//         colors={({ data }) => data.color}
//         colorBy="indexValue"
//       />
