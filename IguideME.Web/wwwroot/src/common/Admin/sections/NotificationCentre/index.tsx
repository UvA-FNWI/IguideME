import React, { Component } from "react";
import Admin from "../../index";
import { Divider, Table } from "antd";
import type { ColumnsType} from 'antd/es/table';
import DataMartController from "../../../../api/controllers/datamart";
import StudentController from "../../../../api/controllers/student";
import {PerformanceNotification, Notifications, Data, NotificationStatus} from "../../../../models/app/Notification"
import PerformanceNotifications from "../../../../components/visuals/Notifications"
import {CanvasStudent} from "../../../../models/canvas/Student"
import { IState } from "./types";
import TileController from "../../../../api/controllers/tile";
import { Tile } from "../../../../models/app/Tile";

import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import AppController from "../../../../api/controllers/app";

import DatePicker from "react-multi-date-picker";
import { Switch } from "antd";


export default class NotificationCentre extends Component {
  
  state = {
    students: [],
    notifications: [],
    tiles: [],
    dates: [],
    rangeBool : false
  }

  componentDidMount(): void {
    StudentController.getStudents().then(async (students: CanvasStudent[]) => {
      for (let i = 0; i < students.length; i++) {
        let enabled = await AppController.getNotificationEnable(students[i].userID)
        students[i].notifications = enabled
      }
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
    let student;
    for (let i = 0; i < students.length; i++) {
      student = students[i];
      console.log("notifications", student.notifications!)

      data.set(student.userID, new Data(student.userID, student.name, student.notifications!));
    }

    let notification;
    let entry;
    for (let i = 0; i < notifications.length; i++) {
      notification = notifications[i];
      entry = data.get(notification.userID)!;

      if (!entry) {
        continue;
      }

      switch (notification.status) {
        case NotificationStatus.outperforming:
          if (notification.sent) {
            entry.previous.outperforming.push(notification)
          } else {
            entry.current.outperforming.push(notification)
          }
          break;
        case NotificationStatus.closing_gap:
          if (notification.sent) {
            entry.previous.closing.push(notification)
          } else {
            entry.current.closing.push(notification)
          }
          break;
        case NotificationStatus.more_effort:
          if (notification.sent) {
            entry.previous.more_effort.push(notification)
          } else {
            entry.current.more_effort.push(notification)
          }
          break;
      }
    }

    let results: Data[] = [];

    data.forEach((value: Data) => results.push(value))

    return results;
  }

  render(): React.ReactNode {
    const { students, notifications, tiles, dates, rangeBool }: IState = this.state;
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
            console.log("value", value);
            if (value) {
              return (
                <span className={"successText"}>
                  <CheckCircleOutlined />
                </span>
              );
            } else {
              return  (
                <span className={"dangerText"}>
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

        Range?

        <Switch
          onClick={(value:any)=>{
            this.setState({rangeBool:!rangeBool, dates:[]});
          }}
          checked={rangeBool}
        />

        <DatePicker 
          multiple = {true}
          range = {rangeBool}
          // rangeHover = {true}
          value={this.state.dates} 
          onChange={dateObject=>{
            this.setState({dates: dateObject})
            console.log("HEEEEEEEEEEEEEEEEEEEEEERE");
            console.log(dateObject?.toString());
            AppController.setNotificationDates((dateObject?.toString())!)
            // .then(notificationDates => this.setState({dates: notificationDates}));
          }} 
        />


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
