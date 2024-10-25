import { Tile } from '@/types/tile';
import { TableColumnsType } from 'antd';
import { CommonData } from './common-table';
import { GradingType, printGrade, TileGrade } from '@/types/grades';
import { User } from '@/types/user';

type StartsWithGrade = `grade${string}`;
type StartsWithMax = `max${string}`;

interface TileData {
  [key: StartsWithGrade]: number | undefined;
  [key: StartsWithMax]: number | undefined;
}

export const getTileColumns = (tiles: Tile[]): TableColumnsType<CommonData & TileData> => {
  return tiles.map((tile) => ({
    title: (
      <div className='text-ellipsis' style={{ width: '6vw', maxHeight: 100 }}>
        {tile.title}
      </div>
    ),
    dataIndex: 'grade' + tile.id,
    key: 'grade' + tile.id,
    sorter: (a, b) => (a[`grade${tile.id}`] ?? -1) - (b[`grade${tile.id}`] ?? -1),
    width: '9vw',
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
  tile_grades:
    | Array<{
        userID: string;
        tile_grades: TileGrade[];
      }>
    | undefined,
): (CommonData & TileData)[] => {
  return students.map((student, index) => {
    const t_grades = tile_grades?.find((tg) => tg.userID === student.userID)?.tile_grades;

    const result: CommonData & TileData = {
      key: index.toString(),
      student,
      name: student.name,
    };

    t_grades?.forEach((tg) => {
      result[`grade${tg.tile_id}`] = tg.grade;
      result[`max${tg.tile_id}`] = tg.max;
    });

    return result;
  });
};
