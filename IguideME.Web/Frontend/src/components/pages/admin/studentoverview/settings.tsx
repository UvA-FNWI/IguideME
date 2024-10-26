import { ConsentEnum, type User } from '@/types/user';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import type { TableColumnsType } from 'antd/lib';
import { type CommonData } from './common-table';

export interface SettingsData {
  consent?: ConsentEnum;
  total?: number;
  // predicted?: number;
  goal?: number;
  notifications?: boolean;
}

export const getSettingsData = (students: User[]): Array<CommonData & SettingsData> => {
  return students.map((student) => ({
    student,
    key: student.userID,
    name: student.name,
    consent: student.settings?.consent,
    total: student.settings?.total_grade ? parseFloat(student.settings.total_grade.toFixed(1)) : undefined,
    predicted: student.settings?.predicted_grade ? parseFloat(student.settings.predicted_grade.toFixed(1)) : undefined,
    goal: student.settings?.goal_grade ? parseFloat(student.settings.goal_grade.toFixed(1)) : undefined,
    notifications: student.settings?.notifications,
  }));
};
export const getSettingsColumns = (): TableColumnsType<CommonData & SettingsData> => {
  return [
    {
      title: 'Grades',
      children: [
        {
          title: 'Current',
          dataIndex: 'total',
          sorter: (a, b) => (a.total ?? -1) - (b.total ?? -1),
          render: (text: string, record: CommonData & SettingsData) => {
            if (Number(text) !== -1) {
              return (
                <p className={record.total && record.total < 5.5 ? 'text-failure' : ''}>{record.total ?? '...'}</p>
              );
            } else {
              return '...';
            }
          },
        },
        // {
        //   title: 'Predicted',
        //   dataIndex: 'predicted',
        //   sorter: (a, b) => (a.predicted ?? -1) - (b.predicted ?? -1),
        //   render: (text: string, record: TableData) => {
        //     if (Number(text) !== -1) {
        //       return (
        //         <p className={record.predicted && record.predicted < 5.5 ? 'text-failure' : ''}>
        //           {record.predicted ?? '...'}
        //         </p>
        //       );
        //     } else {
        //       return '...';
        //     }
        //   },
        // },
        {
          title: 'Goal',
          dataIndex: 'goal',
          sorter: (a, b) => (a.goal ?? -1) - (b.goal ?? -1),
          render: (text: string, record: CommonData & SettingsData) => {
            if (Number(text) !== -1) {
              return <p className={record.goal && record.goal < 5.5 ? 'text-failure' : ''}>{record.goal ?? '...'}</p>;
            } else {
              return '...';
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
          filters: [
            {
              text: 'No data',
              value: 0,
            },
            {
              text: 'Consent given',
              value: 1,
            },
            {
              text: 'Consent not given',
              value: 2,
            },
          ],
          onFilter: (value, record) => record.consent === value,
          sorter: (a, b) => {
            const consentA = a.consent === undefined ? 0 : +a.consent;
            const consentB = b.consent === undefined ? 0 : +b.consent;
            return consentB - consentA;
          },
          render: (value: ConsentEnum) => {
            if (value === ConsentEnum.Accepted) {
              return (
                <Tooltip title='Consent given'>
                  <CheckCircleOutlined className='text-success' />
                </Tooltip>
              );
            } else if (value === ConsentEnum.Refused) {
              return (
                <Tooltip title='No consent given'>
                  <CloseCircleOutlined className='text-failure' />
                </Tooltip>
              );
            } else if (value === ConsentEnum.None) {
              <Tooltip title='No data'>
                <CloseCircleOutlined className='text-gray-500' />
              </Tooltip>;
            } else {
              <Tooltip title='Error'>
                <ExclamationCircleOutlined className='text-failure' />
              </Tooltip>;
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
};
