import { type ReactElement, useMemo } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd/lib';
import type { ColumnType } from 'antd/lib/table';

import { printGrade, type Tile } from '@/types/tile';
import type { User } from '@/types/user';

interface TileGrade {
  tile_id: number;
  grade: number;
  max: number;
}

interface NestedTableProps {
  student: User;
  tiles: Tile[];
  tileGrades: {
    userID: string;
    goal: number;
    tile_grades: TileGrade[];
  }[];
}

function NestedTable({ student, tiles, tileGrades }: NestedTableProps): ReactElement {
  interface GradeInfo {
    grade: number;
    max: number;
  }

  const expandedRowData: Record<string, GradeInfo>[] = useMemo(() => {
    const data: Record<string, GradeInfo> = {};

    tileGrades
      .find((grades) => grades.userID === student.userID)
      // eslint-disable-next-line camelcase -- API response
      ?.tile_grades.forEach(({ tile_id, grade, max }) => {
        data[`tile ${String(tile_id)}`] = { grade, max };
      });

    return [data];
  }, [student, tileGrades]);

  const columns: TableColumnsType<Record<string, GradeInfo>> = tiles.reduce<
    TableColumnsType<Record<string, GradeInfo>>
  >((acc, tile) => {
    if (tile.title === 'Hidden') return acc;

    const column: ColumnType<Record<string, GradeInfo>> = {
      title: tile.title,
      dataIndex: `tile ${String(tile.id)}`,
      render: (text: string, record: Record<string, GradeInfo>) => {
        if (Number(text) !== -1) {
          const grades = record[`tile ${String(tile.id)}`] as GradeInfo | undefined;
          if (grades) return <p>{printGrade(tile.gradingType, grades.grade, grades.max)}</p>;
        }

        return 'N/A';
      },
    };

    acc.push(column);
    return acc;
  }, []);

  return (
    <Table
      className='custom-table'
      columns={columns}
      dataSource={expandedRowData}
      scroll={{ x: 900, y: 600 }}
      pagination={false}
      bordered
      sticky
    />
  );
}

export { NestedTable };
