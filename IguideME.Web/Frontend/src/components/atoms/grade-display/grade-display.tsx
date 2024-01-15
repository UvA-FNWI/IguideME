import { Space } from "antd";
import { useContext, type FC, type ReactElement } from "react";
import { SmileTwoTone } from "@ant-design/icons";
import { tileViewContext } from "@/components/pages/student-dashboard/context";

import "./style.scss";
import { Bar, type BarConfig } from "@ant-design/charts";

const GradeDisplay: FC = (): ReactElement => {
  const viewType = useContext(tileViewContext);
  const goal = 80;
  const avg = 90;
  const pred = 70;

  switch (viewType) {
    case "grid":
      return <GridGrades goal={goal} avg={avg} pred={pred} />;
    case "graph":
      return <GraphGrades goal={goal} avg={avg} pred={pred} />;
  }
};

interface Props {
  goal: number;
  avg: number;
  pred: number;
}
const GridGrades: FC<Props> = ({ goal, avg, pred }): ReactElement => {
  return (
    <Space size="large" style={{ justifyContent: "center", width: "100%" }}>
      <div className="gradeView">
        <p>Goal</p>
        <h2>
          <SmileTwoTone
            size={11}
            style={{ marginRight: 8 }}
            twoToneColor="#00cc66"
          />
          {goal}
        </h2>
      </div>
      <div className="gradeView">
        <p>Current</p>
        <h2>
          <SmileTwoTone
            size={11}
            style={{ marginRight: 8 }}
            twoToneColor="#00cc66"
          />
          {avg}
        </h2>
      </div>
      <div className="gradeView">
        <p>Predicted</p>
        <h2>
          <SmileTwoTone
            size={11}
            style={{ marginRight: 8 }}
            twoToneColor="#00cc66"
          />
          {pred}
        </h2>
      </div>
    </Space>
  );
};

const GraphGrades: FC<Props> = ({ goal, avg, pred }): ReactElement => {
  const max = 100;
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
    color: ["rgba(90, 50, 255, .9)", "rgba(90, 50, 255, .9)"],
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
