import { getStudentsWithSettings } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { type User } from '@/types/user';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Col, Row, Table, Tooltip } from 'antd';
import { type ColumnsType } from 'antd/lib/table';
import { type FC, type ReactElement } from 'react';
import { Tile } from '@/types/tile';

const GradesTable: FC = (): ReactElement => {
  // In principe zijn deze 2 routes voor nu genoeg denk ik
  // TODO: Check of deze routes nog nodig zijn
  //   const { data: tiles } = useQuery({
  //     queryKey: ['tiles'],
  //     queryFn: getTiles,
  //   });

  //   const { data: tileGrades } = useQuery({
  //     queryKey: ['tilegrades'],
  //     queryFn: getAllTileGrades,
  //   });

  // Deze hieronder laat ik staan zodat de voorbeeld tabel werkt, maar zal uiteindelijk niet nodig zijn vgm
  const {
    data: students,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['students', 'settings'],
    queryFn: getStudentsWithSettings,
  });

  return (
    <div className='relative overflow-visible' id={'settingsTable'}>
      <QueryLoading isLoading={isLoading}>
        <Row className='content-end justify-between pb-[10px]'>
          <h2 className='text-xl'>General Overview</h2>
        </Row>

        {isError ?
          <QueryError className='static' title='Failed to load students' />
        : <Table
            className='[&_div]:!text-text [&_td]:!bg-surface1 [&_td]:!text-text [&_th]:!bg-surface1 [&_th]:!text-text'
            size='middle'
            columns={getColumns()}
            dataSource={getData(students ?? [])}
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
  consent: boolean | undefined;
  total: number | undefined;
  predicted: number | undefined;
  goal: number | undefined;
  notifications: boolean | undefined;
}
function getData(students: User[]): DataType[] {
  return students.map((student) => ({
    student,
    key: student.userID,
    name: student.name,
    consent: student.settings?.consent,
    total: student.settings?.total_grade,
    predicted: student.settings?.predicted_grade,
    goal: student.settings?.goal_grade,
    notifications: student.settings?.notifications,
  }));
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
      dataIndex: tile.id,
      width: 50,
      sorter: (a, b) => (a.grade ?? -1) - (b.grade ?? -1),
      render: (text: string, record: DataType) => {
        if (Number(text) !== -1) {
          return (
            <p>
              {((record.grade ?? 0) / 10).toFixed(1)}
              <br />
            </p>
          );
        }
      },
    })),
  );
}

export default GradesTable;
