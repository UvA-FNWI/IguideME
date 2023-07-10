import React, { Component } from "react";
import Admin from "../../index";
import { Divider } from "antd";
import DashboardLayoutConfiguration from "../../../../components/DashboardLayoutConfiguration";
import {IProps} from "./types";

export default class Dashboard extends Component<IProps> {
  render(): React.ReactNode {
    return (
      <Admin menuKey={"dashboard"}>
        <h1>Dashboard</h1>
        <span>Configure the dashboard visible to students.</span>

        <Divider />

        <DashboardLayoutConfiguration />
      </Admin>
    )
  }
}