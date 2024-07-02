import QueryError from '@/components/particles/QueryError';
import ViewTileGroup from '../tile-group-view/tile-group-view';
import { Col, Row, Spin } from 'antd';
import { getLayoutColumns, getTileGroups } from '@/api/tiles';
import { useQuery } from '@tanstack/react-query';
import { Fragment, type FC, type ReactElement } from 'react';

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
      <div className='absolute inset-0 grid h-screen w-screen place-content-center'>
        {loading ?
          <Spin
            className='[&>div]:right-[-45px] [&>div]:min-w-max'
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
      <div className='pointer-events-none absolute inset-0 grid h-screen w-screen place-content-center'>
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
    <Row className='mx-auto mb-3 flex flex-col flex-nowrap gap-3 xl:flex-row'>
      {columns.map((column, index) => (
        <Fragment key={index}>
          <div className='flex flex-col gap-3 xl:hidden'>
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
          <Col key={column.id} span={Math.round((24 * column.width) / 100)} className='hidden flex-shrink xl:block'>
            <div className='grid h-full gap-3'>
              {column.groups.map((id) => {
                const group = tilegroups.find((group) => group.id === id);
                return (
                  group !== undefined && (
                    <div
                      className={`h-[calc(100%/${column.groups.length})] [&>div>div]:!h-full [&>div]:!h-full`}
                      key={id}
                    >
                      <ViewTileGroup key={id} group={group} />
                    </div>
                  )
                );
              })}
            </div>
          </Col>
        </Fragment>
      ))}
    </Row>
  );
};
export default ViewLayout;
