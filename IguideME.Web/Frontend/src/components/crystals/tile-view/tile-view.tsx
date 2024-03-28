import GraphTile from '@/components/crystals/graph-tile/graph-tile.tsx';
import GridTile from '@/components/crystals/grid-tile/grid-tile.tsx';
import Loading from '@/components/particles/loading';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import { Col, Divider, Row } from 'antd';
import { getTileGrades } from '@/api/tiles';
import { tileViewContext } from '@/components/pages/student-dashboard/context';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import './style.scss';
import { useContext, type FC, type ReactElement } from 'react';

import { TileType, type Tile, GradingType } from '@/types/tile';

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
  const navigate = useNavigate();

  const max = 100;

  return (
    <div
      className="tileView"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate(tile.id + '/');
      }}
    >
      <Row justify={'center'} align={'middle'} style={{ height: '20%' }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 1400,
            fontFamily: '"Antic Slab", serif',
            lineHeight: 'normal',
          }}
        >
          {tile.title}
        </h3>
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
