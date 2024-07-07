import { AssignmentDetail, DiscussionDetail, LearningGoalDetail } from '@/components/atoms/entry-details/entry-details';
import { TileType, type TileEntry } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

interface Props {
  entry: TileEntry;
  type: TileType;
}
const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  return (
    <div className='h-[230px] w-[270px] max-w-xs rounded-md border border-solid border-border1 bg-surface1'>
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
