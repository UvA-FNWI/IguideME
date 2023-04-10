import React, { Component } from "react";
import { IProps } from "./types";
import { Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import StudentDashboard from "../StudentDashboard";
import "./style.scss";

export default class AdminDashboard extends Component<IProps> {
  render(): React.ReactNode {
    if (!this.props.student) {
      return (
        <div id={"getStarted"}>
          <Result
            icon={<SmileOutlined />}
            title={
              <div>
                <h2>Pick a student to start!</h2>
                <h1 id={"brand"}>IguideME</h1>
              </div>
            }
          />
        </div>
      );
    }

    return (<StudentDashboard student={this.props.student} />);
  }
}
