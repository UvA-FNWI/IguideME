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

  if (columns.find((col) => col.groups.length > 0) === undefined) {
    return (
      <div className='absolute inset-0 w-screen h-screen grid place-content-center pointer-events-none'>
        <QueryError
          className='grid place-content-center'
          title='The dashboard has not been set up yet.'
          subTitle={
            <p>
              If you are an instructor, you can modify the layout and tiles in the course settings.
              <br />
              If you are an student, please notify your instructor.
            </p>
          }
        />
      </div>
    );
  }

  return (
    <Row className='flex flex-col lg:flex-row gap-3 flex-nowrap mx-auto mb-3'>
      {columns.map((column) => (
        <>
          <div className='lg:hidden flex flex-col gap-3'>
            {column.groups.map((id) => {
              const group = tilegroups.find((group) => group.id === id);
              return (
                group !== undefined && (
                  <div className='space-y-3' key={id}>
                    <ViewTileGroup key={id} group={group} />
                  </div>
                )
              );
            })}
          </div>
          <Col key={column.id} span={Math.round((24 * column.width) / 100)} className='hidden lg:block flex-shrink'>
            <div className='h-full grid gap-3'>
              {column.groups.map((id) => {
                const group = tilegroups.find((group) => group.id === id);
                return (
                  group !== undefined && (
                    <div
                      className={`h-[calc(100%/${column.groups.length})] [&>div]:!h-full [&>div>div]:!h-full`}
                      key={id}
                    >
                      <ViewTileGroup key={id} group={group} />
                    </div>
                  )
                );
              })}
            </div>
          </Col>
        </>
      ))}
    </Row>
  );
};
export default ViewLayout;
