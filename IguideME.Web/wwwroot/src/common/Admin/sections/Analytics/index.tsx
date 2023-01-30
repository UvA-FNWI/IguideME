import React, { Component } from "react";
import Admin from "../../index";
import { Divider } from "antd";
import { IProps } from "./types";
import ApplicationAnalytics from "../../../../components/analytics/ApplicationAnalytics";
import TileTraffic from "../../../../components/analytics/TileTraffic";
import TileConversions from "../../../../components/analytics/TileConversions";

export default class Analytics extends Component<IProps> {
  render(): React.ReactNode {
    return (
      <Admin menuKey={"analytics"}>
        <h1>Analytics</h1>

        <Divider />

        <h2>User interactions</h2>
        <p>Graph overview of all user interactions.</p>
        {/* TODO: Sadly this is not usable and we need to create a graph ourselves */}
        <ApplicationAnalytics />

        <Divider />

        <h2>Tile traffic</h2>
        <p>Each ribbon shows the traffic volume between all views.</p>
        <TileTraffic />

        <Divider />

        <h2>Tile conversions</h2>
        <TileConversions />
      </Admin>
    )
  }
}