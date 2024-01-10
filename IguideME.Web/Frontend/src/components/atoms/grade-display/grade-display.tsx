import { Space } from "antd";
import { useContext, type FC, type ReactElement } from "react";
import { SmileTwoTone } from "@ant-design/icons";
import { tileViewContext } from "@/components/pages/student-dashboard/context";

import "./style.scss";
import { ResponsiveBar } from "@nivo/bar";

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
  return (
    <div style={{ height: "50px", width: "100% " }}>
      <ResponsiveBar
        data={[
          {
            key: "Current",
            tooltipName: "Current grade",
            grade: avg,
            color: "rgba(90, 50, 255, .9)",
            borderColor: "rgba(50, 10, 215, 1)",
          },
          {
            key: "Predicted",
            tooltipName: "Predicted grade",
            grade: pred,
            color: "rgba(83, 198, 150, .9)",
            borderColor: "rgba(43, 158, 110, 1)",
          },
        ]}
        markers={[
          {
            axis: "x",
            value: goal,
            lineStyle: {
              stroke: "rgba(0, 0, 0, .4)",
              strokeWidth: 2,
              strokeDasharray: 4,
            },
            textStyle: {
              fontSize: "8pt",
            },
            legend: "Goal",
            legendOrientation: "horizontal",
            legendPosition: "center",
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
            {d.data.tooltipName}: <b>{d.value}</b>
          </div>
        )}
        keys={["grade"]}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          truncateTickAt: 0,
        }}
        axisBottom={null}
        minValue={0}
        margin={{ top: 45, right: 0, bottom: 50, left: 55 }}
        maxValue={100}
        padding={0.2}
        borderWidth={1}
        borderColor={({ data }) => data.data.borderColor}
        layout="horizontal"
        colors={({ data }) => data.color}
        colorBy="indexValue"
      />
    </div>
  );
};

export default GradeDisplay;
