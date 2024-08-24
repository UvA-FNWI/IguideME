import { type FC, memo, type ReactElement, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import { type ColumnProps } from 'antd/es/table';
import { isThisWeek } from 'date-fns';

import { ActionTypes, type EventReturnType } from '@/types/analytic';

interface PageVisitsProps {
  actionDetailLength: Map<string, number>;
  analytics?: EventReturnType[];
}

const PageVisits: FC<PageVisitsProps> = memo(({ actionDetailLength, analytics }): ReactElement => {
  const pageVisitData = useMemo(() => {
    const pageVisitData = new Map<string, { allTime: number; thisWeek: number }>();
    if (!analytics) return pageVisitData;

    analytics.forEach((event) => {
      if (event.action !== ActionTypes.Page && event.action !== ActionTypes.Tile) return;

      const page = event.action_detail;
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

const pageVisitDataColumns: ColumnProps<PageVisitData>[] = [
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
