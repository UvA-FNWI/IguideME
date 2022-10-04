import React, { Component } from "react";
import Admin from "../../index";
import { Divider, Table } from "antd";
import type { ColumnsType, TableProps } from 'antd/es/table';
import NotificationCentreController, {Notifications} from "../../../../api/controllers/notificationcentre";
import { IState } from "./types";

const onChange: TableProps<Notifications>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

export default class NotificationCentre extends Component {
  state = {
    notifications: []
  }

  componentDidMount(): void {
    NotificationCentreController.getNotifications().then((notifications: Notifications[]) =>
        this.setState({
            notifications: notifications,
        })
    );
}

  render(): React.ReactNode {
    const { notifications }: IState = this.state;
    const columns: ColumnsType<Notifications> = [
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
                dataSource={notifications}
                onChange={onChange}
          />
        </div>

      </Admin>
    )
  }
}