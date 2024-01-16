import { TileType, type Grades, printGrade } from "@/types/tile";
import {
  LikeTwoTone,
  MessageFilled,
  MessageOutlined,
  TrophyFilled,
  TrophyOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import { Space } from "antd";
import { type FC, type ReactElement } from "react";
interface Props {
  type: TileType;
  grades: Grades;
}
const GridTile: FC<Props> = ({ type, grades }): ReactElement => {
  let inner = <></>;
  switch (type) {
    case TileType.assignments:
      inner = <Assignments {...grades} />;
      break;
    case TileType.discussions:
      inner = <Discussions {...grades} />;
      break;
    case TileType.learning_outcomes:
      inner = <Learnings {...grades} />;
      break;
  }
  return <div style={{ fontSize: 18 }}>{inner}</div>;
};

const Assignments: FC<Grades> = ({ grade, max, type }): ReactElement => {
  return (
    <Space align="end">
      <div>
        {grade > 50 ? (
          <LikeTwoTone
            twoToneColor={"rgb(0, 185, 120)"}
            style={{ fontSize: 18 }}
          />
        ) : (
          <WarningTwoTone
            twoToneColor={"rgb(255, 110, 90)"}
            style={{ fontSize: 18 }}
          />
        )}
      </div>
      {printGrade(type, grade, max)}
    </Space>
  );
};

const Discussions: FC<Grades> = ({ grade }): ReactElement => {
  return (
    <Space>
      {grade.toFixed(0)}
      <MessageFilled />
    </Space>
  );
};

const Learnings: FC<Grades> = ({ grade, max }): ReactElement => {
  return (
    <Space>
      {grade.toFixed(0)}/{max}
      <TrophyOutlined />
    </Space>
  );
};

export default GridTile;
