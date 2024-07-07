import { FrownOutlined, MehOutlined, MessageOutlined, SmileOutlined, TrophyOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { printGrade, TileType, type Grades } from '@/types/tile';
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

export const GradeView: FC<Grades> = ({ grade, max, peerAvg, type }): ReactElement => {
  return (
    <Space className='content-end'>
      {grade === 0 ?
        '...'
      : <>
          <div>
            {grade < 50 ?
              <FrownOutlined className='text-lg text-failure' />
            : grade >= peerAvg || (max === -1 && grade > 0) ?
              <SmileOutlined className='text-lg text-success' />
            : <MehOutlined className='text-lg text-meh' />}
          </div>
          <p className='text-lg'>{printGrade(type, grade, max)}</p>
        </>
      }
    </Space>
  );
};

const Discussions: FC<Grades> = ({ grade, max }): ReactElement => {
  return (
    <Space>
      <p>{grade === 0 ? '...' : ((grade * max) / 100).toFixed(0)}</p>
      <MessageOutlined className='text-text' />
    </Space>
  );
};

const Learnings: FC<Grades> = ({ grade, max, type }): ReactElement => {
  return (
    <Space>
      <p>{grade === 0 ? '...' : <>{printGrade(type, grade, max)}</>}</p>
      <TrophyOutlined className='text-success' />
    </Space>
  );
};

export default GridTile;
