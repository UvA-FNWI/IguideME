import { Table } from 'antd';
import { ActionTypes, type EventReturnType, isThisWeek } from '@/utils/analytics';
import { type FC, memo, type ReactElement, useCallback, useMemo } from 'react';
import { type ColumnProps } from 'antd/es/table';
import type { Tile } from '@/types/tile';

interface PageVisitsProps {
  actionDetailLength: Map<string, number>;
  analytics?: EventReturnType[];
  tiles: Tile[];
}

const PageVisits: FC<PageVisitsProps> = memo(({ actionDetailLength, analytics, tiles }): ReactElement => {
  const pageVisitData = useMemo(() => {
    const pageVisitData = new Map<string, { allTime: number; thisWeek: number }>();
    if (!analytics) return pageVisitData;

    analytics.forEach((event) => {
      if (event.action !== ActionTypes.page && event.action !== ActionTypes.tile) return;

      let page: string = '';
      if (event.action === ActionTypes.page) page = event.action_detail;
      else if (event.action === ActionTypes.tile) {
        page = tiles.find((tile) => tile.id === parseInt(event.action_detail))?.title ?? 'Tile tile.id not found';
      }

      const currentCount = pageVisitData.get(page) ?? { allTime: 0, thisWeek: 0 };

      const newCount = {
        allTime: currentCount.allTime + 1,
        thisWeek: currentCount.thisWeek + (isThisWeek(event.timestamp) ? 1 : 0),
      };

      pageVisitData.set(page, newCount);
    });

    return pageVisitData;
  }, [analytics]);

  const formatTime = useCallback((minutes: number): string => {
    const min = Math.floor(minutes);
    const sec = Math.round((minutes * 60) % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')} min`;
  }, []);

  const pageVisitDataRows = useMemo(() => {
    return Array.from(pageVisitData.entries()).map(([page, { allTime, thisWeek }], index) => ({
      key: index,
      page,
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
