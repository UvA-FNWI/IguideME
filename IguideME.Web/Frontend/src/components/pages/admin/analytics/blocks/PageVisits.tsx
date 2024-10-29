import { Table } from 'antd';
import { ActionTypes, type EventReturnType } from '@/utils/analytics';
import { type FC, memo, type ReactElement, useCallback, useMemo } from 'react';
import { type ColumnProps } from 'antd/es/table';
import type { Tile } from '@/types/tile';

interface PageVisitsProps {
  actionDetailLength: Map<string, number>;
  analytics?: EventReturnType[];
  currentWeek: Date;
  tiles: Tile[];
}

const PageVisits: FC<PageVisitsProps> = memo(({ actionDetailLength, analytics, currentWeek, tiles }): ReactElement => {
  const pageVisitData = useMemo(() => {
    const pageVisitData = new Map<string, { allTime: number; pageName: string; thisWeek: number }>();
    if (!analytics) return pageVisitData;

    analytics.forEach((event) => {
      if (event.action !== ActionTypes.page && event.action !== ActionTypes.tile) return;

      let pageName: string = '';
      if (event.action === ActionTypes.page) pageName = event.action_detail;
      else if (event.action === ActionTypes.tile) {
        pageName = tiles.find((tile) => tile.id === parseInt(event.action_detail))?.title ?? 'Tile tile.id not found';
      }

      const currentCount = pageVisitData.get(event.action_detail) ?? { allTime: 0, pageName, thisWeek: 0 };

      const newCount = {
        allTime: currentCount.allTime + 1,
        pageName: currentCount.pageName,
        thisWeek: currentCount.thisWeek + (new Date(event.timestamp) >= currentWeek ? 1 : 0),
      };

      pageVisitData.set(event.action_detail, newCount);
    });

    return pageVisitData;
  }, [analytics]);

  const formatTime = useCallback((minutes: number): string => {
    const min = Math.floor(minutes);
    const sec = Math.round((minutes * 60) % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')} min`;
  }, []);

  const pageVisitDataRows = useMemo(() => {
    return Array.from(pageVisitData.entries()).map(([page, { allTime, pageName, thisWeek }], index) => ({
      key: index,
      page: pageName,
      allTime,
      thisWeek,
      avgTime: formatTime(actionDetailLength.get(page) ?? 0),
    }));
  }, [pageVisitData]);

  return (
    <Table
      className='custom-table'
      columns={pageVisitDataColumns}
      dataSource={pageVisitDataRows}
      pagination={{ pageSize: 5 }}
      size='small'
    />
  );
});
PageVisits.displayName = 'PageVisits';
export default PageVisits;

export interface PageVisitData {
  page: string;
  allTime: number;
  thisWeek: number;
}

const pageVisitDataColumns: Array<ColumnProps<PageVisitData>> = [
  {
    title: 'Page',
    dataIndex: 'page',
    key: 'page',
  },
  {
    title: 'All Time',
    dataIndex: 'allTime',
    key: 'allTime',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.allTime - b.allTime,
  },
  {
    title: 'This Week',
    dataIndex: 'thisWeek',
    key: 'thisWeek',
    sorter: (a, b) => a.thisWeek - b.thisWeek,
  },
  {
    title: 'Avg. Time',
    dataIndex: 'avgTime',
    key: 'avgTime',
  },
];
