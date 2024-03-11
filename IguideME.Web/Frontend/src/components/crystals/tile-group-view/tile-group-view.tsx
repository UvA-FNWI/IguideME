import { getGroupTiles } from '@/api/tiles';
import { type TileGroup } from '@/types/tile';
import { Row, Col } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useQuery } from 'react-query';
import TileView from '../tile-view/tile-view';

interface Props {
  group: TileGroup;
}

const ViewTileGroup: FC<Props> = ({ group }): ReactElement => {
  const { data: tiles } = useQuery('tiles' + group.id, async () => await getGroupTiles(group.id));
  return (
    <div className="rounded-md bg-slate-50 border border-solid border-gray-200 min-h-[300px] h-full">
      <div className="m-3">
        <h2 className="text-center overflow-hidden text-ellipsis whitespace-nowrap">{group.title}</h2>
      </div>
      <Row justify="space-evenly" gutter={[10, 78]} className="my-[10px]">
        {tiles?.map((tile) => (
          <Col key={tile.id}>
            <TileView textStyle="text-center overflow-hidden text-ellipsis whitespace-nowrap" tile={tile} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewTileGroup;
