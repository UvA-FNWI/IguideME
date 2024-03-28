import EntryView from '@/components/crystals/entry-view/entry-view';
import GroupView from '@/components/particles/group-view/group-view';
import Loading from '@/components/particles/loading';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { getTile } from '@/api/tiles';
import { tileViewContext } from '../student-dashboard/context';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useContext, type ReactElement, useCallback, useEffect } from 'react';

function TileDetailView(): ReactElement {
  const { tid } = useParams();
  const context = useContext(tileViewContext);

  const { data: tile } = useQuery(`tile/${tid}/${context.user!.userID}`, async () => await getTile(tid ?? -1));

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
  if (tile === undefined) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col>
          <Button
            className="border border-solid rounded-[20px] w-[50px] ml-[20px] p-0"
            type={'link'}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              back();
            }}
          />
        </Col>
      </Row>
      <Row className="min-h-[60vh] p-1">
        <Col className="p-1" span={24}>
          <GroupView title={tile.title}>
            {tile.entries.map((entry) => (
              <Col key={entry.content_id}>
                <EntryView entry={entry} type={tile.type} />
              </Col>
            ))}
          </GroupView>
        </Col>
      </Row>
    </>
  );
}

export default TileDetailView;
