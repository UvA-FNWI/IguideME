import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import { Table, Tooltip } from 'antd';
import { useMemo, type FC, type ReactElement } from 'react';
import type { TableColumnsType } from 'antd/lib';
import { getStudentsWithSettings } from '@/api/users';
import { useQuery } from '@tanstack/react-query';
import { getTiles } from '@/api/tiles';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import NestedTable from './NestedTable';
import QueryError from '@/components/particles/QueryError';
import { useAntFilterDropdown } from './AntFilterDropdown';
import { User } from '@/types/user';
import { getAllUserTileGrades } from '@/api/grades';

export interface TableData {
  student: User;
  name: string;

  consent?: boolean;
  total?: number;
  predicted?: number;
  goal?: number;
  notifications?: boolean;
}

const StudentOverview: FC = (): ReactElement => {
  const {
    data: students,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['students', 'settings'],
    queryFn: getStudentsWithSettings,
  });

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
    queryFn: getAllUserTileGrades,
  });

  const data: TableData[] = useMemo(() => {
    if (!students) return [];

    return students.map((student) => ({
      student,
      key: student.userID,
      name: student.name,
      consent: student.settings?.consent,
      total: student.settings?.total_grade ? parseFloat(student.settings.total_grade.toFixed(1)) : undefined,
      predicted:
        student.settings?.predicted_grade ? parseFloat(student.settings.predicted_grade.toFixed(1)) : undefined,
      goal: student.settings?.goal_grade ? parseFloat(student.settings.goal_grade.toFixed(1)) : undefined,
      notifications: student.settings?.notifications,
    }));
  }, [students]);

  const columns: TableColumnsType<TableData> = [
    {
      title: 'Student',
      dataIndex: 'name',
      ...useAntFilterDropdown('name'),
    },
    {
      title: 'Grades',
      children: [
        {
          title: 'Current',
          dataIndex: 'total',
          sorter: (a, b) => (a.total ?? -1) - (b.total ?? -1),
          render: (text: string, record: TableData) => {
            if (Number(text) !== -1) {
              return (
                <p className={record.total && record.total < 5.5 ? 'text-failure' : ''}>{record.total ?? 'N/A'}</p>
              );
            } else {
              return 'N/A';
            }
          },
        },
        {
          title: 'Predicted',
          dataIndex: 'predicted',
          sorter: (a, b) => (a.predicted ?? -1) - (b.predicted ?? -1),
          render: (text: string, record: TableData) => {
            if (Number(text) !== -1) {
              return (
                <p className={record.predicted && record.predicted < 5.5 ? 'text-failure' : ''}>
                  {record.predicted ?? 'N/A'}
                </p>
              );
            } else {
              return 'N/A';
            }
          },
        },
        {
          title: 'Goal',
          dataIndex: 'goal',
          sorter: (a, b) => (a.goal ?? -1) - (b.goal ?? -1),
          render: (text: string, record: TableData) => {
            if (Number(text) !== -1) {
              return <p className={record.goal && record.goal < 5.5 ? 'text-failure' : ''}>{record.goal ?? 'N/A'}</p>;
            } else {
              return 'N/A';
            }
          },
        },
      ],
    },
    {
      title: 'Settings',
      children: [
        {
          title: 'Consent',
          dataIndex: 'consent',
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
      ],
    },
  ];

  return (
    <div>
      <AdminTitle description='An overview of students grades and consent.' title='Student Overview' />
      {isError || isTilesError || isGradesError ?
        <QueryError className='top-20' title='Failed to fetch student data' />
      : <Table
          className='custom-table'
          columns={columns}
          dataSource={data}
          scroll={{ x: 900, y: 600 }}
          loading={isLoading || isTilesLoading || isGradesLoading}
          sticky
          expandable={{
            expandedRowRender: (record) => (
              <NestedTable student={record.student} tiles={tiles ?? []} tileGrades={tileGrades ?? []} />
            ),
          }}
        />
      }
    </div>
  );
};

export default StudentOverview;
