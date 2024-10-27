import EntryView from '@/components/crystals/entry-view/entry-view';
import GroupView from '@/components/particles/group-view/group-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getTile } from '@/api/tiles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserRoles } from '@/types/user';
import { useTileViewStore } from '../student-dashboard/tileViewContext';
import { type ReactElement, useCallback, useEffect } from 'react';
import AltEntries from '@/components/atoms/alt-entries/alt-entries';
import { useRequiredParams } from '@/utils/params';

function TileDetailView(): ReactElement {
  const { tileId } = useRequiredParams(['tileId']);
  const { user } = useTileViewStore((state) => ({ user: state.user }));

  useEffect(() => {
    if (user.role === UserRoles.student) {
      trackEvent({
        userID: user.userID,
        action: ActionTypes.tile,
        actionDetail: tileId,
        courseID: user.course_id,
      }).catch(() => {
        // Silently fail, since this is not critical
      });
    }
  }, []);

  const {
    data: tile,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`tile/${tileId}/${user.userID}`],
    queryFn: async () => await getTile(tileId),
  });

  const navigate = useNavigate();

  const back = (): void => {
    navigate('..');
  };

  const keyManager = useCallback((event: any) => {
    switch (event.key) {
      case 'Escape':
        back();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyManager);
    return () => {
      window.removeEventListener('keydown', keyManager);
    };
  });

  return (
    <div>
      <Button
        className='custom-default-button ml-1'
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          back();
        }}
      >
        Back
      </Button>

      <QueryLoading isLoading={isLoading}>
        <div className='flex w-full justify-normal p-1'>
          <GroupView title={tile ? tile.title : ''}>
            {isError ?
              <div className='relative w-full h-full'>
                <QueryError className='grid place-content-center' title='Failed to load tile' />
              </div>
            : tile?.alt ?
              <AltEntries tile={tile} />
            : tile?.entries.map((entry) => <EntryView entry={entry} key={entry.content_id} type={tile.type} />)}
          </GroupView>
        </div>
      </QueryLoading>
    </div>
  );
}

export default TileDetailView;
