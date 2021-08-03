import React, { Component } from "react";
import Admin from "../../index";
import {Divider, Space} from "antd";
import RequireConsent from "../../../../components/settings/RequireConsent";
import AcceptList from "../../../../components/settings/AcceptList";
import PeerGroups from "../../../../components/settings/PeerGroups";

export default class Settings extends Component {
  render(): React.ReactNode {
    return (
      <Admin menuKey={"settings"}>
        <h1>Settings</h1>
        <Divider />

        <Space direction={"vertical"} style={{width: '100%'}}>
          <RequireConsent />
          <AcceptList />
          <PeerGroups />
        </Space>
      </Admin>
    )
  }
}