import GroupView from '@/components/particles/group-view/group-view';
import TileView from '../tile-view/tile-view';
import { Col } from 'antd';
import { getGroupTiles } from '@/api/tiles';
import { useQuery } from '@tanstack/react-query';
import { type TileGroup } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

interface Props {
  group: TileGroup;
}

const ViewTileGroup: FC<Props> = ({ group }): ReactElement => {
  const { data: tiles } = useQuery({
    queryKey: ['tiles', group.id],
    queryFn: async () => await getGroupTiles(group.id),
  });

  return (
    <GroupView title={group.title}>
      {tiles?.map((tile) => (
        <Col key={tile.id}>
          <TileView tile={tile} />
        </Col>
      ))}
    </GroupView>
  );
};

export default ViewTileGroup;
