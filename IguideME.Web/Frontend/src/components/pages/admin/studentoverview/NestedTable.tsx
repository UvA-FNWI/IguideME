import { printGrade, TileGrade, type Tile } from '@/types/tile';
import type { User } from '@/types/user';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd/lib';
import type { ColumnType } from 'antd/lib/table';
import { memo, useMemo, type FC, type ReactElement } from 'react';

interface NestedTableProps {
  student: User;
  tiles: Tile[];
  tileGrades: Array<{
    userID: string;
    goal: number;
    tile_grades: TileGrade[];
  }>;
}

const NestedTable: FC<NestedTableProps> = memo(({ student, tiles, tileGrades }): ReactElement => {
  interface GradeInfo {
    grade: number;
    max: number;
  }

  const expandedRowData: Array<Record<string, GradeInfo>> = useMemo(() => {
    const data: Record<string, GradeInfo> = {};

    tileGrades
      .find((grades) => grades.userID === student.userID)
      ?.tile_grades.forEach(({ tile_id, grade, max }) => {
        data['tile ' + tile_id] = { grade: grade, max: max };
      });

    return [data];
  }, [student, tileGrades]);

  const columns: TableColumnsType<Record<string, GradeInfo>> = tiles.reduce<
    TableColumnsType<Record<string, GradeInfo>>
  >((acc, tile) => {
    if (tile.title === 'Hidden') return acc;

    const column: ColumnType<Record<string, GradeInfo>> = {
      title: tile.title,
      dataIndex: 'tile ' + tile.id,
      render: (text: string, record: Record<string, GradeInfo>) => {
        if (Number(text) !== -1) {
          const grades = record['tile ' + tile.id] as GradeInfo | undefined;
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
});
NestedTable.displayName = 'NestedTable';
export default NestedTable;
