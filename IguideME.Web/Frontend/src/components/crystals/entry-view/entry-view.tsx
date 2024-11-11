import { AssignmentDetail, DiscussionDetail, LearningGoalDetail } from '@/components/atoms/entry-details/entry-details';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { TileType, type TileEntry } from '@/types/tile';
import { ExportOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  entry: TileEntry;
  type: TileType;
}

const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  const { viewType } = useTileViewStore(
    useShallow((state) => ({
      viewType: state.viewType,
    })),
  );

  return (
    <Card
      className='custom-card-student-dashboard'
      cover={renderViewType()}
      size='small'
      title={
        <div className='flex justify-between gap-2'>
          <h3
            className='my-auto overflow-hidden text-ellipsis text-nowrap text-center font-bold text-text'
            title={entry.title}
          >
            {entry.title}
          </h3>
          {!entry.html_url ?
            <a className='text-text' href={entry.html_url} target='_blank' rel='noopener noreferrer'>
              <ExportOutlined />
            </a>
          : ''}
        </div>
      }
    />
  );

  function renderViewType(): ReactElement {
    switch (type) {
      case TileType.assignments:
        return <AssignmentDetail entry={entry} viewType={viewType ?? 'graph'} />;
      case TileType.discussions:
        return <DiscussionDetail entry={entry} viewType={viewType ?? 'graph'} />;
      case TileType.learning_outcomes:
        return <LearningGoalDetail entry={entry} viewType={viewType ?? 'graph'} />;
      default:
        throw new Error('Unknown tile type');
    }
  }
};

export default EntryView;
