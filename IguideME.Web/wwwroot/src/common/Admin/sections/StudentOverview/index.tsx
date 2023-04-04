import React, { Component } from "react";
import Admin from "../../index";
import {Divider, Space} from "antd";
import StudentGradesTable from "../../../../components/StudentGradesTable";
import StudentConsentTable from "../../../../components/StudentConsentTable";

export default class StudentOverview extends Component {

  render(): React.ReactNode {
    return (
      <Admin menuKey={"studentOverview"}>
        <h1>Student Overview</h1>
        <Divider />

        <Space direction={"vertical"} style={{ width: '100%' }}>
          <StudentGradesTable />
        </Space>
        <Divider />

        <Space direction={"vertical"} style={{ width: '100%' }}>
          <StudentConsentTable />
        </Space>
      </Admin>
    )
  }
}
