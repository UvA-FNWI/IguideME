import { type Tile } from '@/types/tile';
import { type TableColumnsType } from 'antd';
import { type CommonData } from './common-table';
import { GradingType, printGrade, type TileGrade } from '@/types/grades';
import { type User } from '@/types/user';

type StartsWithGrade = `grade${string}`;
type StartsWithMax = `max${string}`;

export interface TileData {
  [key: StartsWithGrade]: number | undefined;
  [key: StartsWithMax]: number | undefined;
}

export const getTileColumns = (tiles: Tile[]): TableColumnsType<CommonData & TileData> => {
  return tiles.map((tile) => ({
    title: tile.title,
    dataIndex: 'grade' + tile.id,
    key: 'grade' + tile.id,
    sorter: (a, b) => (a[`grade${tile.id}`] ?? -1) - (b[`grade${tile.id}`] ?? -1),
    filters:
      tile.gradingType !== GradingType.NotGraded ?
        [
          {
            text: 'Passing grade',
            value: 1,
          },
          {
            text: 'Failing',
            value: -1,
          },
        ]
      : undefined,
    onFilter: (value, record) => {
      if (typeof value === 'number') {
        return value * ((record[`grade${tile.id}`] ?? 0) - 50) >= 0;
      }
      console.warn('Warning, unknown value found in getTileColumns', value);
      return true;
    },
    render: (value: number, record) => {
      const grade = record[`grade${tile.id}`];
      return (
        <div className={tile.gradingType !== GradingType.NotGraded && value < 50 ? 'text-failure' : ''}>
          {grade === undefined ? '...' : printGrade(tile.gradingType, grade, record[`max${tile.id}`] ?? -1, false)}
        </div>
      );
    },
  }));
};

export const getTileData = (
  students: User[],
  tileGrades:
    | Array<{
        userID: string;
        tileGrades: TileGrade[];
      }>
    | undefined,
): Array<CommonData & TileData> => {
  return students.map((student, index) => {
    const tGrades = tileGrades?.find((tg) => tg.userID === student.userID)?.tileGrades;

    const result: CommonData & TileData = {
      key: index.toString(),
      student,
      name: student.name,
    };

    tGrades?.forEach((tg) => {
      result[`grade${tg.tile_id}`] = tg.grade;
      result[`max${tg.tile_id}`] = tg.max;
    });

    return result;
  });
};
