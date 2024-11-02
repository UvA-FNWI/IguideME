import { type TableColumnsType } from 'antd';
import { type CommonData } from './common-table';
import { type Tile } from '@/types/tile';
import { type EntryGradeMap, GradingType, printGrade } from '@/types/grades';
import { type User } from '@/types/user';
import { objectExists } from '@/helpers/general';

type StartsWithGrade = `grade${string}`;
type StartsWithMax = `max${string}`;
type StartsWithType = `type${string}`;

export interface EntryData {
  [key: StartsWithGrade]: number | undefined;
  [key: StartsWithMax]: number | undefined;
  [key: StartsWithType]: number | undefined;
}

export const getEntryColumns = (tiles: Tile[]): TableColumnsType<CommonData & EntryData> => {
  return tiles
    .filter((tile) => tile.entries.length > 0)
    .map((tile) => ({
      title: (
        <div className='text-ellipsis' style={{ minWidth: '5vw', maxHeight: 100 }}>
          {tile.title}
        </div>
      ),
      children: tile.entries.map((entry) => ({
        title: (
          <div className='text-ellipsis' style={{ width: '6vw', maxHeight: 100 }}>
            {entry.title}
          </div>
        ),
        dataIndex: 'grade' + entry.content_id,
        key: 'grade' + entry.content_id,
        width: '9vw',
        filters: [
          {
            text: 'Passing grade',
            value: 1,
          },
          {
            text: 'Failing',
            value: -1,
          },
        ],
        onFilter: (value, record) => {
          if (typeof value === 'number') {
            return value * ((record[`grade${entry.content_id}`] ?? 0) - 50) >= 0;
          }
          console.warn('Warning, unknown value found in getEntryColumns', value);
          return true;
        },
        sorter: (a, b) => (a[`grade${entry.content_id}`] ?? -1) - (b[`grade${entry.content_id}`] ?? -1),
        render: (value: number, record) => {
          const type = record[`type${entry.content_id}`] ?? GradingType.NotGraded;
          const grade = record[`grade${entry.content_id}`];
          return (
            <div className={type !== GradingType.NotGraded && value < 50 ? 'text-failure' : ''}>
              {objectExists(grade) ? printGrade(type, grade, record[`max${entry.content_id}`] ?? -1, false) : '...'}
            </div>
          );
        },
      })),
    }));
};

export const getEntryData = (students: User[], grades: EntryGradeMap | undefined): Array<CommonData & EntryData> => {
  return students.map((student, index) => {
    const eGrades = grades?.[student.userID];
    const result: CommonData & EntryData = {
      key: index.toString(),
      student,
      name: student.name,
    };

    eGrades?.forEach((eg) => {
      result[`grade${eg.content_id}`] = eg.grade;
      result[`max${eg.content_id}`] = eg.max;
      result[`type${eg.content_id}`] = eg.grading_type;
    });
    return result;
  });
};
