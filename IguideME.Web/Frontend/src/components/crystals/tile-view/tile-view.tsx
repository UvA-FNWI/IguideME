import GraphTile from '@/components/crystals/graph-tile/graph-tile.tsx';
import GridTile from '@/components/crystals/grid-tile/grid-tile.tsx';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import { Card, Divider, Row } from 'antd';
import { getUserTileGrades } from '@/api/grades';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { type Tile, TileType } from '@/types/tile';
import { memo, type FC, type ReactElement } from 'react';
import { GradingType, type Grades } from '@/types/grades';
import { useShallow } from 'zustand/react/shallow';
import { SlidersOutlined } from '@ant-design/icons';

interface Props {
  tile: Tile;
}

const ViewTile: FC<Props> = memo(({ tile }): ReactElement => {
  const { user, viewType } = useTileViewStore(
    useShallow((state) => ({
      user: state.user,
      viewType: state.viewType,
    })),
  );

  const {
    data: grades,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [user.userID, tile.id],
    queryFn: async () => await getUserTileGrades(user.userID, tile.id),
  });

  const navigate = useNavigate();

  return (
    <div
      className={`${tile.type === TileType.assignments && tile.gradingType === GradingType.NotGraded ? 'grayscale-[30%] saturate-[.80]' : ''}`}
    >
      <Card
        actions={[
          <a
            className='!text-text/60 hover:!text-text'
            onClick={() => {
              navigate(tile.id + '/');
            }}
            key='details'
          >
            See assignments
          </a>,
        ]}
        className='custom-card-student-dashboard'
        cover={
          grades ?
            renderViewType(grades)
          : <div className='!flex h-full w-full !items-center !justify-center'>
              <SlidersOutlined className='text-text/50' style={{ fontSize: '400%' }} />
            </div>
        }
        loading={isLoading}
        size='small'
        title={
          <div className='w-full flex-col text-center'>
            <h3 className='text-lg font-normal'>{tile.title}</h3>
            {tile.type === TileType.assignments && tile.gradingType === GradingType.NotGraded && !grades ?
              <p className='text-xs text-text/60'>Not graded / No grades yet</p>
            : <>
                {tile.type === TileType.assignments && tile.gradingType === GradingType.NotGraded && (
                  <p className='text-xs text-text/60'>Not graded</p>
                )}
                {!grades && <p className='text-xs text-text/60'>No grades yet</p>}
              </>
            }
          </div>
        }
      />
    </div>
  );

  function renderViewType(grades: Grades): ReactElement {
    if (isError) return <QueryError className='grid place-content-center' title='Failed to load grades' />;

    switch (viewType) {
      case 'graph':
        return (
          <Row className='h-4/5 content-center justify-center'>
            <GraphTile type={tile.type} grades={grades} />
          </Row>
        );
      case 'grades':
        return (
          <div className='!flex h-full flex-col'>
            <div className='grid flex-grow place-content-center'>
              <GridTile type={tile.type} grades={grades} />
            </div>
            <div className='shrink-0'>
              <Divider className='m-0 border-text p-0' />
              <PeerComparison grades={grades} />
            </div>
          </div>
        );
      default:
        throw new Error('Unknown tile type');
    }
  }
});
ViewTile.displayName = 'ViewTile';
export default ViewTile;
