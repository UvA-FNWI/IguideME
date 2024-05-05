import { AssignmentDetail, DiscussionDetail, LearningGoalDetail } from '@/components/atoms/entry-details/entry-details';
import { Row } from 'antd';
import { TileType, type TileEntry } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

interface Props {
  entry: TileEntry;
  type: TileType;
}
const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  return (
    <div className='border border-solid w-[270px] h-[230px] bg-cardBackground border-text rounded-md'>
      <Row className='p-2 w-full flex justify-center items-center overflow-hidden'>
        <h3 className='whitespace-nowrap overflow-ellipsis overflow-hidden text-base font-bold'>{entry.title}</h3>
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
