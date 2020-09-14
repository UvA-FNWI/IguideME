import React, { PureComponent } from "react";
import "./grade-distribution.scss";

type IProps = {
  min: number;
  max: number;
  avg: number;
}

export default class GradeDistribution extends PureComponent<IProps> {
  render() {
    const { min, max, avg } = this.props;
    return (
      <div className={"grade-distribution"}>
        <div className={"min"}>
          <small>min</small><span>{ min }</span>
        </div>
        <div className={"distribution"}>
          <small>mean</small>
          <div className={"avg"}><span>{avg}</span></div>
          <div className={"sep"} style={{left: `${((avg - min) / (max - min)) * 100}%`}} />
        </div>
        <div className={"max"}>
          <small>max</small><span>{ max }</span>
        </div>
      </div>
    );
  }
}