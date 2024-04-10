import GroupView from '@/components/particles/group-view/group-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
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
  const {
    data: tiles,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['tiles', group.id],
    queryFn: async () => await getGroupTiles(group.id),
  });

  return (
    <QueryLoading isLoading={isLoading}>
      <GroupView title={group.title}>
        {isError ?
          <QueryError className='grid place-content-center' title='Error: Unable to load tiles' />
        : tiles?.map((tile) => (
            <Col key={tile.id}>
              <TileView tile={tile} />
            </Col>
          ))
        }
      </GroupView>
    </QueryLoading>
  );
};

export default ViewTileGroup;
