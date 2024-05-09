import { getTile } from '@/api/tiles';
import EntryView from '@/components/crystals/entry-view/entry-view';
import GroupView from '@/components/particles/group-view/group-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Col, Row } from 'antd';
import { type ReactElement, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTileViewStore } from '../student-dashboard/tileViewContext';

function TileDetailView(): ReactElement {
  const { tid } = useParams();
  const { user } = useTileViewStore((state) => ({
    user: state.user,
  }));

  const {
    data: tile,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`tile/${tid}/${user.userID}`],
    queryFn: async () => await getTile(tid ?? -1),
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
    <>
      <Row>
        <Col>
          <Button
            className='ml-[20px] !w-[50px] rounded-[20px] border border-solid border-primary bg-body p-0 hover:!bg-text/10 [&>span]:!text-text'
            type={'link'}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              back();
            }}
          />
        </Col>
      </Row>
      <Row className='min-h-[60vh] p-1 [&>div]:w-full'>
        <QueryLoading isLoading={isLoading}>
          <div className='flex w-full justify-normal p-1'>
            <GroupView title={tile ? tile.title : ''}>
              {isError ?
                <QueryError className='grid place-content-center' title='Failed to load tile' />
              : tile?.entries.map((entry) => (
                  <Col key={entry.content_id}>
                    <EntryView entry={entry} type={tile.type} />
                  </Col>
                ))
              }
            </GroupView>
          </div>
        </QueryLoading>
      </Row>
    </>
  );
}

export default TileDetailView;
