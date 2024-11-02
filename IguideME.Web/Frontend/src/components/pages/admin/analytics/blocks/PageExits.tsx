import { ActionTypes, isThisWeek } from '@/utils/analytics';
import { Table } from 'antd';
import { type ColumnProps } from 'antd/es/table';
import { type FC, memo, useMemo } from 'react';
import { type SessionData } from '../analytics';
import { type PageVisitData } from './PageVisits';
import type { Tile } from '@/types/tile';

interface PageExitsProps {
  sessions: Map<string, SessionData[]>;
  tiles: Tile[];
}

const PageExits: FC<PageExitsProps> = memo(({ sessions, tiles }) => {
  const exitPageData: Map<string, { allTime: number; thisWeek: number }> = useMemo(() => {
    const exitPageData = new Map<string, { allTime: number; thisWeek: number }>();

    sessions.forEach((sessionDataArray, _) => {
      // Sort the array by timestamp
      sessionDataArray.sort((a, b) => a.timestamp - b.timestamp);

      // Find the last action that is either of type page or tile
      const exitPage = sessionDataArray
        .filter((data) => data.action === ActionTypes.page || data.action === ActionTypes.tile)
        .pop();

      if (exitPage) {
        let page: string = '';
        if (exitPage.action === ActionTypes.page) page = exitPage.action_detail;
        else if (exitPage.action === ActionTypes.tile) {
          page = tiles.find((tile) => tile.id === parseInt(exitPage.action_detail))?.title ?? 'Tile tile.id not found';
        }

        const currentCount = exitPageData.get(page) ?? { allTime: 0, thisWeek: 0 };

        const newCount = {
          allTime: currentCount.allTime + 1,
          thisWeek: currentCount.thisWeek + (isThisWeek(exitPage.timestamp) ? 1 : 0),
        };

        exitPageData.set(page, newCount);
      }
    });

    return exitPageData;
  }, [sessions]);

  const PageExitsRows = useMemo(() => {
    return Array.from(exitPageData.entries()).map(([page, { allTime, thisWeek }], index) => ({
      key: index,
      page,
      allTime,
      thisWeek,
    }));
  }, [exitPageData]);

  return (
    <Table
      className='custom-table'
      columns={PageExitsColumns}
      dataSource={PageExitsRows}
      pagination={{ pageSize: 5 }}
      size='small'
    />
  );
});
PageExits.displayName = 'PageExits';
export default PageExits;

const PageExitsColumns: Array<ColumnProps<PageVisitData>> = [
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
];
