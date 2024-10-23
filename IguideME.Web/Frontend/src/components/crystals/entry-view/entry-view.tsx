import { AssignmentDetail, DiscussionDetail, LearningGoalDetail } from '@/components/atoms/entry-details/entry-details';
import { TileType, type TileEntry } from '@/types/tile';
import { ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { type FC, type ReactElement } from 'react';

interface Props {
  entry: TileEntry;
  type: TileType;
}
const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  return (
    <div className='border-border1 bg-surface1 h-[230px] w-[270px] max-w-xs rounded-md border border-solid'>
      <div className='h-full w-full'>
        <div className='flex h-1/6 w-full place-content-center items-center justify-between px-4 py-2'>
          <div>{false && <QuestionCircleOutlined />}</div>
          <div className='w-4/6'>
            <h3 className='text-text my-auto overflow-hidden text-ellipsis text-nowrap text-center font-bold'>
              {entry.title}
            </h3>
          </div>
          <div>
            {entry.html_url ?
              <a href={entry.html_url} target='_blank' rel='noopener noreferrer'>
                <ExportOutlined />
              </a>
            : ''}
          </div>
        </div>
        {renderViewType()}
      </div>
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
