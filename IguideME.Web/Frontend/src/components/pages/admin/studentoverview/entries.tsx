import { TableColumnsType } from 'antd';
import { CommonData } from './common-table';
import { Tile } from '@/types/tile';
import { EntryGradeMap, GradingType, printGrade } from '@/types/grades';
import { User } from '@/types/user';

type StartsWithGrade = `grade${string}`;
type StartsWithMax = `max${string}`;
type StartsWithType = `type${string}`;

interface EntryData {
  [key: StartsWithGrade]: number | undefined;
  [key: StartsWithMax]: number | undefined;
  [key: StartsWithType]: number | undefined;
}

export const getEntryColumns = (tiles: Tile[]): TableColumnsType<CommonData & EntryData> => {
  return tiles
    .filter((tile) => tile.entries.length > 0)
    .map((tile) => ({
      title: tile.title,
      children: tile.entries.map((entry) => ({
        title: (
          <div className='text-ellipsis' style={{ width: '6vw', maxHeight: 100 }}>
            {entry.title}
          </div>
        ),
        dataIndex: 'grade' + entry.content_id,
        key: 'grade' + entry.content_id,
        width: '8vw',
        sorter: (a, b) => (a[`grade${entry.content_id}`] ?? -1) - (b[`grade${entry.content_id}`] ?? -1),
        render: (value: number, record) => {
          const type = record[`type${entry.content_id}`] ?? GradingType.NotGraded;
          return (
            <div className={type !== GradingType.NotGraded && value < 50 ? 'text-failure' : ''}>
              {printGrade(
                type,
                record[`grade${entry.content_id}`] ?? -1,
                record[`max${entry.content_id}`] ?? -1,
                false,
              )}
            </div>
          );
        },
      })),
    }));
};

export const getEntryData = (students: User[], grades: EntryGradeMap | undefined): (CommonData & EntryData)[] => {
  return students.map((student, index) => {
    const e_grades = grades?.[student.userID];
    const result: CommonData & EntryData = {
      key: index.toString(),
      student,
      name: student.name,
    };

    e_grades?.forEach((eg) => {
      result[`grade${eg.content_id}`] = eg.grade;
      result[`max${eg.content_id}`] = eg.max;
      result[`type${eg.content_id}`] = eg.grading_type;
    });
    return result;
  });
};
