import { getAllTileGrades, getTiles } from '@/api/tiles';
import { getStudentsWithSettings } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { type User } from '@/types/user';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Col, Row, Table, Tooltip } from 'antd';
import { type ColumnsType } from 'antd/lib/table';
import { type FC, type ReactElement } from 'react';

const GradesTable: FC = (): ReactElement => {
  // In principe zijn deze 2 routes voor nu genoeg denk ik
  const { data: tiles } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const { data: tileGrades } = useQuery({
    queryKey: ['tilegrades'],
    queryFn: getAllTileGrades,
  });

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
          <Col>
            <h2 className='text-xl'>General Overview</h2>
          </Col>
          <Col>
            Consent Given:{' '}
            {!isError && students ?
              <>
                {students.filter((student: User) => student.settings?.consent).length}/{students.length}
              </>
            : <>0/0</>}
          </Col>
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

function getColumns(): any {
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
    {
      title: 'Total',
      dataIndex: 'total',
      width: 50,
      sorter: (a, b) => (a.total ?? -1) - (b.total ?? -1),
      render: (text: string, record: DataType) => {
        if (Number(text) !== -1) {
          return (
            <p>
              {((record.total ?? 0) / 10).toFixed(1)}
              <br />
            </p>
          );
        }
      },
    },
    {
      title: 'Predicted',
      dataIndex: 'predicted',
      width: 50,
      sorter: (a, b) => (a.predicted ?? -1) - (b.predicted ?? -1),
      render: (text: string, _: any) => {
        if (Number(text) !== -1) {
          return (
            <p>
              {text}
              <br />
            </p>
          );
        }
      },
    },
    {
      title: 'Goal',
      dataIndex: 'goal',
      width: 50,
      sorter: (a, b) => (a.goal ?? -1) - (b.goal ?? -1),
      render: (text: string, _: any) => {
        if (Number(text) !== -1) {
          return (
            <p>
              {text}
              <br />
            </p>
          );
        }
      },
    },
    {
      title: 'Consent',
      dataIndex: 'consent',
      width: 50,
      sorter: (a, b) => {
        const consentA = a.consent === undefined ? 0 : +a.consent;
        const consentB = b.consent === undefined ? 0 : +b.consent;
        return consentB - consentA;
      },
      filters: [
        {
          text: 'Consent given',
          value: true,
        },
        {
          text: 'Consent not given',
          value: false,
        },
      ],
      onFilter: (value, record) => record.consent === value,
      render: (value: boolean) => {
        if (value) {
          return (
            <Tooltip title='Consent given'>
              <CheckCircleOutlined className='text-success' />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title='No consent given'>
              <CloseCircleOutlined className='text-failure' />
            </Tooltip>
          );
        }
      },
    },
    {
      title: 'Notifications',
      dataIndex: 'notifications',
      width: 50,
      sorter: (a, b) => {
        const notificationsA = a.notifications === undefined ? 0 : +a.notifications;
        const notificationsB = b.notifications === undefined ? 0 : +b.notifications;
        return notificationsB - notificationsA;
      },
      filters: [
        {
          text: 'On',
          value: true,
        },
        {
          text: 'Off',
          value: false,
        },
      ],
      onFilter: (value, record) => record.notifications === value,
      render: (value: boolean) => {
        if (value) {
          return (
            <Tooltip title='Consent given'>
              <CheckCircleOutlined className='text-success' />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title='No consent given'>
              <CloseCircleOutlined className='text-failure' />
            </Tooltip>
          );
        }
      },
    },
  ];
  return columns;
}

export default GradesTable;
