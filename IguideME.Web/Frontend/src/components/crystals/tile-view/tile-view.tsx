import GraphTile from '@/components/crystals/graph-tile/graph-tile.tsx';
import GridTile from '@/components/crystals/grid-tile/grid-tile.tsx';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { cn } from '@/utils/cn';
import { Col, Divider, Row } from 'antd';
import { getUserTileGrades } from '@/api/grades';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { TileType, type Tile } from '@/types/tile';
import { memo, type FC, type ReactElement } from 'react';
import { GradingType } from '@/types/grades';

interface Props {
  tile: Tile;
  textStyle?: string;
}

const ViewTile: FC<Props> = memo(({ tile, textStyle }): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

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
    <QueryLoading isLoading={isLoading}>
      <div
        aria-disabled={isLoading || isError}
        className={`${
          isError ? 'cursor-not-allowed' : 'cursor-pointer'
        } border-border1 bg-surface1 relative h-[230px] w-[270px] rounded-md border border-solid p-2`}
        onClick={() => {
          if (!(isError || isLoading)) navigate(tile.id + '/');
        }}
      >
        <Row className='h-1/5 content-center justify-center'>
          <h3 className={cn('text-lg', textStyle)}>{tile.title}</h3>
        </Row>
        {renderViewType()}
      </div>
    </QueryLoading>
  );

  function renderViewType(): ReactElement {
    if (isError) return <QueryError className='grid place-content-center' title='Failed to load grades' />;
    else if (!grades) return <></>;

    if (tile.type === TileType.assignments && tile.gradingType === GradingType.NotGraded) {
      return (
        <Row className='h-4/5 content-center justify-center'>
          <p className='text-text'>Not Graded</p>
        </Row>
      );
    }
    switch (viewType) {
      case 'graph':
        return (
          <Row className='h-4/5 content-center justify-center'>
            <GraphTile type={tile.type} grades={grades} />
          </Row>
        );
      case 'grid':
        return (
          <>
            <Row className='h-1/2 content-center justify-center'>
              <GridTile type={tile.type} grades={grades} />
            </Row>
            <Row className='h-[30%] w-full content-start justify-center'>
              <Col className='h-full w-full'>
                <Divider className='border-text m-0 p-0' />
                <PeerComparison grades={grades} />
              </Col>{' '}
            </Row>
          </>
        );
      default:
        throw new Error('Unknown tile type');
    }
  }
});
ViewTile.displayName = 'ViewTile';
export default ViewTile;
