import { getTileGrades } from '@/api/tiles';
import GraphTile from '@/components/crystals/graph-tile/graph-tile.tsx';
import GridTile from '@/components/crystals/grid-tile/grid-tile.tsx';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType, TileType, type Tile } from '@/types/tile';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  tile: Tile;
  textStyle?: string;
}

const ViewTile: FC<Props> = ({ tile, textStyle }): ReactElement => {
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
    queryFn: async () => await getTileGrades(user.userID, tile.id),
  });

  const navigate = useNavigate();

  const max = 100;

  return (
    <QueryLoading isLoading={isLoading}>
      <div
        aria-disabled={isLoading || isError}
        className={`${
          isError ? 'cursor-not-allowed' : 'cursor-pointer'
        } w-[270px] h-[230px] border border-solid bg-white border-primary-gray relative`}
        onClick={() => {
          if (isError || isLoading) return;
          else navigate(tile.id + '/');
        }}
      >
        <Row className='h-1/5 justify-center content-center'>
          <h3 className={cn('text-lg', textStyle)}>{tile.title}</h3>
        </Row>
        {renderViewType()}
      </div>
    </QueryLoading>
  );

  function renderViewType(): ReactElement {
    if (isError) return <QueryError title='Failed to load grades' />;
    else if (!grades) return <></>;

    switch (viewType) {
      case 'graph':
        return (
          <Row className='h-4/5 justify-center content-center'>
            <GraphTile
              type={tile.type}
              grades={{
                grade: grades.grade,
                peerAvg: grades.peerAvg,
                peerMin: grades.peerMin,
                peerMax: grades.peerMax,
                max,
                type: tile.gradingType,
              }}
            />
          </Row>
        );
      case 'grid':
        return (
          <>
            <Row className='h-1/2 justify-center content-center'>
              <GridTile
                type={tile.type}
                grades={{
                  grade: grades.grade,
                  peerAvg: grades.peerAvg,
                  peerMin: grades.peerMin,
                  peerMax: grades.peerMax,
                  max,
                  type: tile.gradingType,
                }}
              />
            </Row>
            <Row className='w-full h-[30%] justify-center content-start'>
              <Col className='h-full w-full'>
                <Divider className='m-0 p-0 w-full' />
                <PeerComparison
                  {...{
                    grade: grades.grade,
                    peerAvg: grades.peerAvg,
                    peerMin: grades.peerMin,
                    peerMax: grades.peerMax,
                    max,
                    type: tile.type === TileType.assignments ? tile.gradingType : GradingType.NotGraded,
                  }}
                />
              </Col>{' '}
            </Row>
          </>
        );
      default:
        throw new Error('Unknown tile type');
    }
  }
};

export default ViewTile;
