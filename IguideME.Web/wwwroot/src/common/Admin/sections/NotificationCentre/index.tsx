import React, { Component } from "react";
import Admin from "../../index";
import { Divider, Table } from "antd";
import type { ColumnsType} from 'antd/es/table';
import DataMartController from "../../../../api/controllers/datamart";
import StudentController from "../../../../api/controllers/student";
import {PerformanceNotification, Notifications, Data} from "../../../../models/app/Notification"
import PerformanceNotifications from "../../../../components/visuals/Notifications"
import {CanvasStudent} from "../../../../models/canvas/Student"
import { IState } from "./types";
import TileController from "../../../../api/controllers/tile";
import { Tile } from "../../../../models/app/Tile";

import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";


export default class NotificationCentre extends Component {
  state = {
    students: [],
    notifications: [],
    tiles: []
  }

  componentDidMount(): void {
    StudentController.getStudents().then((students: CanvasStudent[]) => {
      this.setState({
        students: students
      });
    });
    DataMartController.getAllNotifications().then(async (notifications: PerformanceNotification[]) =>
        this.setState({
          notifications: notifications
        })
    );
    TileController.getTiles().then(async (tiles: Tile[]) => {
      this.setState({
        tiles: tiles
      })
    })
  }

  getData(students: CanvasStudent[], notifications: PerformanceNotification[]): Data[] {
    let data = new Map<string, Data>();
    var student;
    for (var i = 0; i < students.length; i++) {
      student = students[i];
      data.set(student.login_id, new Data(student.login_id, student.name, true)); // TODO: set enabled correctly
    }

    console.log("notifications", notifications);
    console.log("data", data);

    var notification;
    var entry;
    for (var i = 0; i < notifications.length; i++) {
      notification = notifications[i];
      entry = data.get(notification.user_login_id)!;

      console.log("entry", entry)

      if (!entry) {
        continue;
      }

      console.log("notification", notification);

      switch (notification.status) {
        case "outperforming peers":
          if (notification.sent) {
            entry.previous.outperforming.push(notification)
          } else {
            entry.current.outperforming.push(notification)
          }
          break;
        case "closing the gap":
          if (notification.sent) {
            entry.previous.closing.push(notification)
          } else {
            entry.current.closing.push(notification)
          }
          break;
        case "more effort required":
          if (notification.sent) {
            entry.previous.more_effort.push(notification)
          } else {
            entry.current.more_effort.push(notification)
          }
          break;
      }
    }

    var results: Data[] = [];

    data.forEach((value: Data) => results.push(value))

    return results;
  }

  render(): React.ReactNode {
    const { students, notifications, tiles }: IState = this.state;
    const columns: ColumnsType<Data> = [
        {
          title: 'Student',
          dataIndex: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          defaultSortOrder: 'ascend'
        },
        {
          title: 'Upcoming',
          dataIndex: 'current',
          render: (value: Notifications) => {
            // console.log("value", value);
            return (
              <PerformanceNotifications outperforming = {value.outperforming}
              closing = {value.closing}
              moreEffort = {value.more_effort}
              tiles = {tiles}
              />
            )
          }
        },
        {
          title: 'Last Received',
          dataIndex: 'previous',
          render: (value: Notifications) => {
            // console.log("value2", value);
            return (
              <PerformanceNotifications outperforming = {value.outperforming}
              closing = {value.closing}
              moreEffort = {value.more_effort}
              tiles = {tiles}
              />
            )
          }
        },
        {
          title: 'Enabled',
          dataIndex: 'enabled',
          render: (value: boolean) => {
            console.log("VAlue", value);
            if (value) {
              return (
                <span className={"successText"}>
                  <CheckCircleOutlined />
                </span>
              );
            } else {
              return  (
                <span className={"successText"}>
                  <CloseCircleOutlined />
                </span>
              );
            }
          }
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
                dataSource={this.getData(students, notifications)}
          />
        </div>

      </Admin>
    )
  }
}