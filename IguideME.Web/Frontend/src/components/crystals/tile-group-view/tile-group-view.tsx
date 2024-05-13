import { getGroupTiles } from '@/api/tiles';
import GroupView from '@/components/particles/group-view/group-view';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { type TileGroup } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import { Col } from 'antd';
import { memo, type FC, type ReactElement } from 'react';
import TileView from '../tile-view/tile-view';

interface Props {
  group: TileGroup;
}

const ViewTileGroup: FC<Props> = memo(({ group }): ReactElement => {
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
            <Col className='h-full' key={tile.id}>
              <TileView tile={tile} />
            </Col>
          ))
        }
      </GroupView>
    </QueryLoading>
  );
});
ViewTileGroup.displayName = 'ViewTileGroup';
export default ViewTileGroup;
