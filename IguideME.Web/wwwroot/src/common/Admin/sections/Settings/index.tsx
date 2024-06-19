import React, { Component } from "react";
import Admin from "../../index";
import {Button, Divider, Space} from "antd";
import RequireConsent from "../../../../components/settings/RequireConsent";
import AcceptList from "../../../../components/settings/AcceptList";
import PeerGroups from "../../../../components/settings/PeerGroups";
import DataMartController from "../../../../api/controllers/datamart";

export default class Settings extends Component {

  text = "";

  render(): React.ReactNode {

    return (
      <Admin menuKey={"settings"}>
        <h1>Settings</h1>
        <Divider />

        <Space direction={"vertical"} style={{width: '100%'}}>
          <RequireConsent />
          <AcceptList />
          <PeerGroups />
          <input
            type="text"
            onChange={(e) => this.text = e.target.value}
            onKeyDown={(event) => {
            if (event.key === 'Enter') {
              DataMartController.logDBTable(this.text);
            }
          }} />
        <Button onClick={() => {
          let data1 = DataMartController.getUsage().then((data) => {
            
            console.log("data", data)

            const csvData = new Blob([data], { type: 'text/csv' });

            const csvURL = URL.createObjectURL(csvData);
            const link = document.createElement('a');
            link.href = csvURL;
            link.download = `usage.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            });
            console.log("data1", data1)
          }}/>
        </Space>
      </Admin>
    )
  }
}
