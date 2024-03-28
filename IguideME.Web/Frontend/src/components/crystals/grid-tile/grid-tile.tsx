import { LikeTwoTone, MessageFilled, TrophyOutlined, WarningTwoTone } from '@ant-design/icons';
import { Space } from 'antd';
import { TileType, type Grades, printGrade } from '@/types/tile';
import { type FC, type ReactElement } from 'react';
interface Props {
  type: TileType;
  grades: Grades;
}

const GridTile: FC<Props> = ({ type, grades }): ReactElement => {
  let inner = <></>;
  switch (type) {
    case TileType.assignments:
      inner = <GradeView {...grades} />;
      break;
    case TileType.discussions:
      inner = <Discussions {...grades} />;
      break;
    case TileType.learning_outcomes:
      inner = <Learnings {...grades} />;
      break;
  }
  return <div className="text-lg">{inner}</div>;
};

export const GradeView: FC<Grades> = ({ grade, max, type }): ReactElement => {
  return (
    <Space className="content-end">
      <div>
        {grade > 50 ? (
          <LikeTwoTone twoToneColor={'rgb(0, 185, 120)'} className="text-lg" />
        ) : (
          <WarningTwoTone twoToneColor={'rgb(255, 110, 90)'} className="text-lg" />
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
