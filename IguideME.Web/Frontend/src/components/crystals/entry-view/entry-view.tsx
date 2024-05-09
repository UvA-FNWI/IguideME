import { AssignmentDetail, DiscussionDetail, LearningGoalDetail } from '@/components/atoms/entry-details/entry-details';
import { TileType, type TileEntry } from '@/types/tile';
import { Row } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  entry: TileEntry;
  type: TileType;
}
const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  return (
    <div className='h-[230px] w-[270px] rounded-md border border-solid border-white bg-card-background'>
      <Row className='flex w-full items-center justify-center overflow-hidden p-2'>
        <h3 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-bold'>{entry.title}</h3>
      </Row>
      {renderViewType()}
    </div>
  );

  function renderViewType(): ReactElement {
    switch (type) {
      case TileType.assignments:
        return <AssignmentDetail entry={entry} />;
      case TileType.discussions:
        return <DiscussionDetail entry={entry} />;
      case TileType.learning_outcomes:
        return <LearningGoalDetail entry={entry} />;
      default:
        throw new Error('Unknown tile type');
    }
  }
};

export default EntryView;
