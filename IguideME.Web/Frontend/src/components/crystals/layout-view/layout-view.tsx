import Loading from '@/components/particles/loading';
import ViewTileGroup from '../tile-group-view/tile-group-view';
import { Col, Row } from 'antd';
import { getLayoutColumns, getTileGroups } from '@/api/tiles';
import { useQuery } from 'react-query';
import { type FC, type ReactElement } from 'react';

const ViewLayout: FC = (): ReactElement => {
  const { data: columns } = useQuery('layout-columns', getLayoutColumns);
  const { data: tilegroups } = useQuery('tile-groups', getTileGroups);

  if (columns === undefined || tilegroups === undefined) {
    return <Loading />;
  }
  return (
    <Row className="max-w-max flex gap-3 flex-nowrap mx-auto">
      {columns.map((column) => (
        <Col key={column.id} span={Math.round((24 * column.width) / 100)} className="flex-shrink">
          <div className="h-full grid gap-3">
            {column.groups.map((id) => {
              const group = tilegroups.find((group) => group.id === id);
              return (
                group !== undefined && (
                  <div className={`h-[calc(100%/${column.groups.length})]`} key={id}>
                    <ViewTileGroup key={id} group={group} />
                  </div>
                )
              );
            })}
          </div>
        </Col>
      ))}
    </Row>
  );
};
export default ViewLayout;
