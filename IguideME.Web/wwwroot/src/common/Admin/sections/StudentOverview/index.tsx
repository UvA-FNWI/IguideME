import React, { Component } from "react";
import Admin from "../../index";
import {Divider, Space, Switch} from "antd";
import StudentGradesTable from "../../../../components/StudentGradesTable";

export default class StudentOverview extends Component {

  state = { averaged: false }

  render(): React.ReactNode {
    const { averaged } = this.state;
    return (
      <Admin menuKey={"studentOverview"}>
        <h1>Student Overview</h1>
        <Divider />

        <Space direction={"vertical"} style={{ width: '100%' }}>
          <div>
            <label>Show averages</label>
            <br />
            <Switch onClick={e => this.setState({ averaged: e })} checked={averaged} />
          </div>

          <StudentGradesTable averaged={averaged} />
        </Space>
      </Admin>
    )
  }
}