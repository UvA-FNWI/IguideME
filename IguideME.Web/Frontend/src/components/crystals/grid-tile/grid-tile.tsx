import { printGrade, TileType, type Grades } from '@/types/tile';
import { LikeTwoTone, MessageFilled, TrophyOutlined, WarningTwoTone } from '@ant-design/icons';
import { Space } from 'antd';
import { type FC, type ReactElement } from 'react';

interface GridTileProps {
  type: TileType;
  grades: Grades;
}

const GridTile: FC<GridTileProps> = ({ type, grades }): ReactElement => {
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
  return <div className='text-lg'>{inner}</div>;
};

export const GradeView: FC<Grades> = ({ grade, max, type }): ReactElement => {
  return (
    <Space className='content-end'>
      {grade === 0 ?
        '...'
      : <>
          <div>
            {grade >= 50 ?
              <LikeTwoTone twoToneColor={'rgb(0, 185, 120)'} className='text-lg' />
            : <WarningTwoTone twoToneColor={'rgb(255, 110, 90)'} className='text-lg' />}
          </div>
          <p className='text-lg'>{printGrade(type, grade, max)}</p>
        </>
      }
    </Space>
  );
};

const Discussions: FC<Grades> = ({ grade }): ReactElement => {
  return (
    <Space>
      <p>{grade === 0 ? '...' : grade.toFixed(0)}</p>
      <MessageFilled />
    </Space>
  );
};

const Learnings: FC<Grades> = ({ grade, max }): ReactElement => {
  return (
    <Space>
      <p>{grade === 0 ?
        '...'
      : <>
          {grade.toFixed(0)}/{max}
        </>
      }</p>
      <TrophyOutlined className='text-success'/>
    </Space>
  );
};

export default GridTile;
