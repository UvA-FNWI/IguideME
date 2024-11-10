import { FrownOutlined, MehOutlined, MessageOutlined, SmileOutlined, TrophyOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { TileType } from '@/types/tile';
import { type Grades, printGrade } from '@/types/grades';
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
      <>
        {grade === 0 && peerAvg === 0 ?
          'N/A'
        : <>
            <div>
              {grade < 50 ?
                <FrownOutlined className='text-failure text-lg' />
              : grade >= peerAvg ?
                <SmileOutlined className='text-success text-lg' />
              : <MehOutlined className='text-meh text-lg' />}
            </div>
            <p className='text-lg'>{printGrade(type, grade, max)}</p>
          </>
        }
      </>
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

const Learnings: FC<Grades> = ({ grade, max, type, peerMax }): ReactElement => {
  return (
    <Space>
      <p>{peerMax === 0 ? '...' : <>{printGrade(type, grade, max)}</>}</p>
      <TrophyOutlined className='text-success' />
    </Space>
  );
};

export default GridTile;
