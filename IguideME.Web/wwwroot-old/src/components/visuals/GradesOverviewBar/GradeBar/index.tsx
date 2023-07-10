import React, { Component } from "react";
import {createBarData, getBarOptions} from "../helpers";
import {Bar} from "react-chartjs-2";

export default class GradeBar extends Component<{
  grades: number[],
  binary: boolean,
  height: number,
  withLegend: boolean
}> {

  static defaultProps = {
    height: 300,
    withLegend: true
  }

  render(): React.ReactNode {
    const { grades, binary, height, withLegend } = this.props;

    return (
      <div>
        <Bar height={height} data={createBarData(grades, binary)} options={getBarOptions(withLegend)} />
      </div>
    );
  }
}