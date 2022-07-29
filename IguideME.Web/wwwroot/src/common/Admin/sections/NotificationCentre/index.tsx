import React, { Component } from "react";
import Admin from "../../index";
import { Divider, Table } from "antd";
import type { ColumnsType, TableProps } from 'antd/es/table';

function getData(): DataType[] {
  return [
    {
      key: '1',
      student: 'Test1',
      notifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      notifications_enabled: "Yes",
    },
    {
      key: '2',
      student: 'Test2',
      notifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      notifications_enabled: "Yes",
    },
  ]
}

interface DataType {
  key: React.Key;
  student: string;
  notifications: string;
  notifications_enabled: string;
}

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

export default class NotificationCentre extends Component {
  render(): React.ReactNode {
    const columns: ColumnsType<DataType> = [
        {
          title: 'Student',
          dataIndex: 'student',
          sorter: (a, b) => a.student.localeCompare(b.student),
        },
        {
          title: 'Notifications',
          dataIndex: 'notifications',
        },
        {
          title: 'Notifications enabled',
          dataIndex: 'notifications_enabled',
        },
      ]

    return (
      <Admin menuKey={"notificationCentre"}>
        <h1>Notification Centre</h1>

        <Divider />

        <div id={"NotificationsTable"} style={{position: 'relative', overflow: 'visible'}}>
          <Table scroll={{ x: 900 }}
                bordered
                sticky={true}
                columns={columns}
                dataSource={getData()}
                onChange={onChange}
          />
        </div>

      </Admin>
    )
  }
}