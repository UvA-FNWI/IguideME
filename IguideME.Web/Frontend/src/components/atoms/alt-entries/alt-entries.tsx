import { getTopics, getUserDiscussionEntries } from '@/api/entries';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { Tile, TileType } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import { Col } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  tile: Tile;
}
const AltEntries: FC<Props> = ({ tile }): ReactElement => {
  return renderViewType();

  function renderViewType(): ReactElement {
    switch (tile.type) {
      case TileType.assignments:
        return <AltAssignments tile={tile} />;
      case TileType.discussions:
        return <AltDiscussions tile={tile} />;
      case TileType.learning_outcomes:
        return <AltLearningGoals tile={tile} />;
      default:
        throw new Error('Unknown tile type');
    }
  }
};

const AltAssignments: FC<Props> = ({ tile }): ReactElement => {
  tile;
  return <></>;
};

const AltDiscussions: FC<Props> = ({ tile }): ReactElement => {
  const { user } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

  const {
    data: discussionTopics,
    isError: topicError,
    isLoading: topicLoading,
  } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => await getTopics(),
  });

  const {
    data: discussionEntries,
    isError: entryError,
    isLoading: entryLoading,
  } = useQuery({
    queryKey: [`${tile.id}/discussions/${user.userID}`],
    queryFn: async () => await getUserDiscussionEntries(user.userID),
  });

  if (entryLoading || topicLoading) {
    return (
      <QueryLoading isLoading={entryLoading}>
        <div className='h-[180px] w-[270px]' />
      </QueryLoading>
    );
  } else if (entryError || topicError || !discussionEntries || !discussionTopics) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  return (
    <>
      {discussionTopics
        .filter((topic) => topic.author === user.userID)
        .map((topic) => (
          <Col key={topic.id}>
            <DiscussionDisplay title={topic.title} message={topic.message} />
          </Col>
        ))}
      {discussionEntries.map((entry) => (
        <Col key={`e${entry.id}d${entry.parent_id}`}>
          <DiscussionDisplay
            title={'Thread → ' + (discussionTopics.find((topic) => topic.id === entry.discussion_id)?.title ?? '')}
            message={entry.message}
          />
        </Col>
      ))}
    </>
  );
};

interface DiscProps {
  title: string;
  message: string;
}
const DiscussionDisplay: FC<DiscProps> = ({ title, message }): ReactElement => {
  return (
    <div className='h-[230px] w-max min-w-[270px] max-w-xs rounded-md border border-solid border-border1 bg-surface1'>
      <div className='h-full w-full p-2'>
        <h3 className='overflow-hidden text-ellipsis text-nowrap text-center font-bold text-text'>{title}</h3>
        <div className='grid h-full w-full place-content-center'>
          <div dangerouslySetInnerHTML={{ __html: message }}></div>
        </div>
      </div>
    </div>
  );
};

const AltLearningGoals: FC<Props> = ({ tile }): ReactElement => {
  tile;
  return <></>;
};

export default AltEntries;
