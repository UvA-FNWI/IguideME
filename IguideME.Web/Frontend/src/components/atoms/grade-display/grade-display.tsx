import { Space } from "antd";
import { useContext, type FC, type ReactElement } from "react";
import { FrownTwoTone, MehTwoTone, SmileTwoTone } from "@ant-design/icons";
import { tileViewContext } from "@/components/pages/student-dashboard/context";

import { Bar, type BarConfig } from "@ant-design/charts";
import Loading from "@/components/particles/loading";
import { type User } from "@/types/user";

const BLUE = "rgba(90, 50, 255, .9)";
const GREEN = "rgba(13, 204, 204, 1)";

interface displayProps {
  self: User;
}

const GradeDisplay: FC<displayProps> = ({ self }): ReactElement => {
  const context = useContext(tileViewContext);

  if (self.settings === undefined) {
    return <Loading />;
  }

  const goal = self.settings.goal_grade;
  const total = self.settings.total_grade;
  const pred = self.settings.predicted_grade;

  switch (context.viewType) {
    case "grid":
      return <GridGrades goal={goal} total={total} pred={pred} />;
    case "graph":
      return <GraphGrades goal={goal} total={total} pred={pred} />;
  }
};

interface Props {
  goal: number;
  total: number;
  pred: number;
}

const GridGrades: FC<Props> = ({ goal, total, pred }): ReactElement => {
  const happy = <SmileTwoTone size={10} twoToneColor="rgb(0, 185, 120)" />;
  const meh = <MehTwoTone size={10} twoToneColor="rgb(245, 226, 54)" />;
  const unhappy = <FrownTwoTone size={10} twoToneColor={"rgb(255, 110, 90)"} />;
  return (
    <Space
      className='justify-center w-full'
      size="large"
    >
      <div className="text-center">
        <p className='m-0'>Goal</p>
        <h2 className='font-gradeDisplay'>
          <Space>
            {goal >= 7 ? happy : goal >= 5.5 ? meh : unhappy}
            {goal}
          </Space>
        </h2>
      </div>
      <div className="text-center">
        <p className='m-0'>Current</p>
        <h2 className='font-gradeDisplay'>
          <Space>
            {total > goal ? happy : total >= 5.5 ? meh : unhappy}
            {total}
          </Space>
        </h2>
      </div>
      <div className="text-center">
        <p className='m-0'>Predicted</p>
        <h2 className='font-gradeDisplay'>
          <Space>
            {pred > goal ? happy : pred >= 5.5 ? meh : unhappy}
            {pred}
          </Space>
        </h2>
      </div>
    </Space>
  );
};

const GraphGrades: FC<Props> = ({ goal, total: avg, pred }): ReactElement => {
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
    margin: 0,
    paddingLeft: 0,
    padding: 20,
    insetLeft: 70,
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
      // x should have label true, but fsr it wants to overlap with the graph
      x: {
        label: true,
        tick: false,
        labelFormatter: (label: string) => label.split(" ")[0] + ":",
      },
      y: { label: false, tick: false },
    },
    tooltip: {
      title: "",
      items: [{ channel: "y", valueFormatter: ".1f" }],
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
    <div className='h-[50px] w-full'>
      <Bar {...config} marginTop={20} marginBottom={30} />
    </div>
  );
};

export default GradeDisplay;
