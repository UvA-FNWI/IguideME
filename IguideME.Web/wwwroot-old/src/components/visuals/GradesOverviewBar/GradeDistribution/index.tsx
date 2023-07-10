import React, { Component } from "react";
import { Space } from "antd";
import "./style.scss";

const compute = require( 'compute.io' );

export default class GradeDistribution extends Component<{ grades: number[] }> {
  render(): React.ReactNode {
    const { grades } = this.props;
    return (
      <div className={"gradeDistribution"}>
        <Space size={20}>
          <div className={"item"}>
            <h3>{ Math.min(...grades)}</h3>
            Minimum
          </div>

          <div className={"item avg"}>
            <h3>{ Math.round(compute.mean(grades) * 100) / 100 }</h3>
            Average
          </div>

          <div className={"item"}>
            <h3>{ Math.max(...grades)}</h3>
            Maximum
          </div>

          <div className={"item"}>
            <h3>{ Math.round((grades.filter(g => g >= 5.5).length / grades.length) * 10000) / 100 }%</h3>
            Pass Rate
          </div>
        </Space>
      </div>
    )
  }
}