import Loading from '@/components/particles/loading';
import QueryError from '@/components/particles/QueryError';
import ViewTileGroup from '../tile-group-view/tile-group-view';
import { Col, Row, Spin } from 'antd';
import { getLayoutColumns, getTileGroups } from '@/api/tiles';
import { useQuery } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

const ViewLayout: FC = (): ReactElement => {
  const {
    data: columns,
    isLoading: LoadingLayoutColumns,
    isError: ErrorLayoutColumns,
  } = useQuery({
    queryKey: ['layout-columns'],
    queryFn: getLayoutColumns,
  });

  const {
    data: tilegroups,
    isLoading: LoadingTileGroups,
    isError: ErrorTileGroups,
  } = useQuery({
    queryKey: ['tile-groups'],
    queryFn: getTileGroups,
  });

  const loading = LoadingLayoutColumns || LoadingTileGroups;
  const error = ErrorLayoutColumns || ErrorTileGroups || columns === undefined || tilegroups === undefined;

  if (loading || error) {
    return (
      <div className='w-screen h-screen absolute inset-0 grid place-content-center'>
        {loading ?
          <Spin
            className='[&>div]:min-w-max [&>div]:right-[-45px]'
            spinning={loading}
            size='large'
            tip='Loading layout'
          >
            <></>
          </Spin>
        : <QueryError className='grid place-content-center' title='Error loading layout' />}
      </div>
    );
  }

  if (columns === undefined || tilegroups === undefined) {
    return <Loading />;
  }

  if (  columns.find(col => col.groups.length > 0) === undefined) {
    // TODO: add error here stating that the course hasn't been set up yet.
    return <div>Error </div>
  }

  console.log("test", columns.find(col => col.groups.length >= 0))
  return (
    <Row className='flex gap-3 flex-nowrap mx-auto'>
      {columns.map((column) => (
        <Col key={column.id} span={Math.round((24 * column.width) / 100)} className='flex-shrink'>
          <div className='h-full grid gap-3'>
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
