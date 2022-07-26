import React, { Component } from "react";
import Admin from "../../index";
import { Divider } from "antd";
import {IProps} from "./types";

export default class NotificationCentre extends Component<IProps> {
  render(): React.ReactNode {
    return (
      <Admin menuKey={"notificationCentre"}>
        <h1>Notification Centre</h1>

        <Divider />

      </Admin>
    )
  }
}