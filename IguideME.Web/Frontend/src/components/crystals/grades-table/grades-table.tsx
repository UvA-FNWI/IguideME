import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { type User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { Row, Table } from 'antd';
import { type ColumnsType } from 'antd/lib/table';
import { type FC, type ReactElement } from 'react';
import { printGrade, Tile, TileGrades } from '@/types/tile';
import { getAllTileGrades, getTiles } from '@/api/tiles';
import { getStudentsWithSettings } from '@/api/users';

const GradesTable: FC = (): ReactElement => {
  const {
    data: tiles,
    isError: isTilesError,
    isLoading: isTilesLoading,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const {
    data: tileGrades,
    isError: isGradesError,
    isLoading: isGradesLoading,
  } = useQuery({
    queryKey: ['tilegrades'],
    queryFn: getAllTileGrades,
  });

  const {
    data: students,
    isError: isStudentError,
    isLoading: isStudentLoading,
  } = useQuery({
    queryKey: ['students', 'settings'],
    queryFn: getStudentsWithSettings,
  });

  return (
    <div className='relative overflow-visible' id={'settingsTable'}>
      <QueryLoading isLoading={isTilesLoading || isGradesLoading || isStudentLoading}>
        <Row className='content-end justify-between pb-[10px]'>
          <h2 className='text-xl'>General Overview</h2>
        </Row>

        {isTilesError || isGradesError || isStudentError ?
          <QueryError className='static' title='Failed to load students' />
        : <Table
            className='[&_div]:!text-text [&_td]:!bg-surface1 [&_td]:!text-text [&_th]:!bg-surface1 [&_th]:!text-text'
            size='middle'
            columns={getColumns(tiles ?? [])}
            dataSource={getData(students ?? [], tileGrades ?? [])}
            scroll={{ x: 900, y: 600 }}
            pagination={{ pageSize: 50 }}
            bordered
            sticky={true}
          />
        }
      </QueryLoading>
    </div>
  );
};

interface DataType {
  student: User;
  name: string;
  [key: string]: { grade: number; max: number } | string | User;
}

function getData(
  students: User[],
  tileGrades: Array<{
    userID: string;
    tile_grades: TileGrades[];
  }>,
): DataType[] {
  return students.map((student) => {
    let result: DataType = {
      student,
      key: student.userID,
      name: student.name,
    };
    console.log('test');

    tileGrades
      .find((grades) => grades.userID === student.userID)
      ?.tile_grades.forEach((grades) => {
        result['tile ' + grades.tile_id] = { grade: grades.grade, max: grades.max };
        console.log('hello');
      });
    return result;
  });
}

interface userTileGrades {
  grade: number;
  max: number;
}

function getColumns(tiles: Tile[]): any {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Student',
      dataIndex: 'name',
      fixed: true,
      width: 80,
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
      render: (text: string, record: DataType) => {
        return (
          <p>
            {text}
            <br />
            <small>{record.student.userID}</small>
          </p>
        );
      },
    },
  ];

  return columns.concat(
    tiles.map((tile) => ({
      title: tile.title,
      dataIndex: 'tile ' + tile.id,
      width: 50,
      sorter: (a, b) =>
        ((a['tile ' + tile.id] as userTileGrades).grade ?? -1) - ((b['tile ' + tile.id] as userTileGrades).grade ?? -1),
      render: (text: string, record) => {
        // console.log(record);
        if (Number(text) !== -1) {
          const grades = record['tile ' + tile.id] as userTileGrades;
          if (grades) {
            return (
              <p>
                {printGrade(tile.gradingType, grades.grade, grades.max)}
                <br />
              </p>
            );
          }
        }
      },
    })),
  );
}

export default GradesTable;
