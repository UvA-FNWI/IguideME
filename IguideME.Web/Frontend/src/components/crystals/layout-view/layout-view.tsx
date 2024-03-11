import { getLayoutColumns, getTileGroups } from '@/api/tiles';
import Loading from '@/components/particles/loading';
import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useQuery } from 'react-query';

import ViewTileGroup from '../tile-group-view/tile-group-view';

const ViewLayout: FC = (): ReactElement => {
  const { data: columns } = useQuery('layout-columns', getLayoutColumns);
  const { data: tilegroups } = useQuery('tile-groups', getTileGroups);

  if (columns === undefined || tilegroups === undefined) {
    return <Loading />;
  }
  return (
    <Row justify="space-evenly" className="px-3 flex gap-1 flex-nowrap">
      {columns.map((column) => (
        <Col key={column.id} span={Math.round((24 * column.width) / 100)}>
          <div className="h-full grid gap-1">
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
