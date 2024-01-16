import { Space } from "antd";
import { useContext, type FC, type ReactElement } from "react";
import { FrownTwoTone, MehTwoTone, SmileTwoTone } from "@ant-design/icons";
import { tileViewContext } from "@/components/pages/student-dashboard/context";

import "./style.scss";
import { Bar, type BarConfig } from "@ant-design/charts";

const BLUE = "rgba(90, 50, 255, .9)";
const GREEN = "rgba(13, 204, 204, 1)";

const GradeDisplay: FC = (): ReactElement => {
  const viewType = useContext(tileViewContext);
  const goal = 7;
  const avg = 9;
  const pred = 7;

  switch (viewType) {
    case "grid":
      return <GridGrades {...{ goal, avg, pred }} />;
    case "graph":
      return <GraphGrades {...{ goal, avg, pred }} />;
  }
};

interface Props {
  goal: number;
  avg: number;
  pred: number;
}
const GridGrades: FC<Props> = ({ goal, avg, pred }): ReactElement => {
  const happy = <SmileTwoTone size={10} twoToneColor="rgb(0, 185, 120)" />;
  const meh = <MehTwoTone size={10} twoToneColor="rgb(245, 226, 54)" />;
  const unhappy = <FrownTwoTone size={10} twoToneColor={"rgb(255, 110, 90)"} />;
  return (
    <Space size="large" style={{ justifyContent: "center", width: "100%" }}>
      <div className="gradeView">
        <p>Goal</p>
        <h2>
          <Space>
            {goal >= 7 ? happy : goal >= 5.5 ? meh : unhappy}
            {goal}
          </Space>
        </h2>
      </div>
      <div className="gradeView">
        <p>Current</p>
        <h2>
          <Space>
            {avg > goal ? happy : avg >= 5.5 ? meh : unhappy}
            {avg}
          </Space>
        </h2>
      </div>
      <div className="gradeView">
        <p>Predicted</p>
        <h2>
          <Space>
            {pred > goal ? happy : pred >= 5.5 ? meh : unhappy}
            {pred}
          </Space>
        </h2>
      </div>
    </Space>
  );
};

const GraphGrades: FC<Props> = ({ goal, avg, pred }): ReactElement => {
  const max = 10;
  const data = [
    {
      name: "Current grade",
      grade: avg,
    },
    {
      name: "Predicted grade",
      grade: pred,
    },
  ];

  const config: BarConfig = {
    data,
    autoFit: true,
    padding: 20,
    colorField: "name",
    color: [BLUE, GREEN],
    xField: "name",
    yField: "grade",
    legend: false,
    sort: {
      // @ts-expect-error I think that the type bindings are incorrect, as this works but the suggested type doesn't
      reverse: "true",
    },
    scale: {
      y: { domainMax: max },
    },
    axis: {
      x: { label: true, tick: false },
      y: { label: false, tick: false },
    },
    tooltip: {
      title: "",
    },
    annotations: [
      {
        type: "lineY",
        // @ts-expect-error I think that the type bindings are incorrect, as this works but the suggested type doesn't
        yField: goal,
        style: {
          stroke: "black",
          strokeOpacity: 1,
          lineWidth: 1,
          lineDash: [8, 3],
        },
      },
    ],
  };
  return (
    <div style={{ height: "50px", width: "100% " }}>
      <Bar {...config} marginTop={20} marginBottom={30} />
    </div>
  );
};

export default GradeDisplay;
