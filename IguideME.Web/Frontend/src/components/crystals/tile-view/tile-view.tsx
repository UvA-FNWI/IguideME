import { useContext, type FC, type ReactElement } from 'react';
import { tileViewContext } from '@/components/pages/student-dashboard/context';

import GraphTile from '@/components/crystals/graph-tile/graph-tile.tsx';
import GridTile from '@/components/crystals/grid-tile/grid-tile.tsx';
import { TileType, type Tile, GradingType } from '@/types/tile';
import { Col, Divider, Row } from 'antd';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import { getTileGrades } from '@/api/tiles';
import { useQuery } from 'react-query';
import Loading from '@/components/particles/loading';
import { cn } from '@/utils/cn';

interface Props {
  tile: Tile;
  textStyle?: string;
}

const ViewTile: FC<Props> = ({ tile, textStyle }): ReactElement => {
  const context = useContext(tileViewContext);
  const { data: grades } = useQuery(
    `tiles grades/${context.user!.userID}/${tile.id}`,
    async () => await getTileGrades(context.user !== undefined ? context.user.userID : '-1', tile.id),
  );

  const max = 100;

  return (
    <div className="w-[270px] h-[230px] border border-solid border-gray-200 bg-white">
      <Row justify={'center'} align={'middle'} className="h-1/5">
        <h3 className={cn('text-lg', textStyle)}>{tile.title}</h3>
      </Row>
      {renderViewType()}
    </div>
  );

  function renderViewType(): ReactElement {
    if (grades === undefined) {
      return (
        <div className="w-full h-1/2 grid items-center">
          <Loading />
        </div>
      );
    }

    switch (context.viewType) {
      case 'graph':
        return (
          <Row justify={'center'} align={'middle'} className="h-4/5">
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
            <Row justify={'center'} align={'middle'} className="h-1/2">
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
            <Row justify={'center'} align={'top'} className="w-full h-[30%]">
              <Col className="h-full w-full">
                <Divider className="m-0 p-0 w-full" />
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
    }
  }
};

export default ViewTile;
