import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { createLineData, getLineOptions} from "./helpers";
import GradeDistribution from "./GradeDistribution";
import GradeBar from "./GradeBar";

export default class GradesOverviewBar extends Component<{
  binary: boolean,
  title: string,
  grades: number[],
}> {

  render(): React.ReactNode {
    const { binary, grades, title } = this.props;

    return (
        <div>
          <h2>{ title }</h2>
          <GradeDistribution grades={grades} />
          <GradeBar height={150} binary={binary} grades={grades} />
          <div style={{ height: 150 }}>
            <Line data={createLineData(grades)} options={getLineOptions()} />
          </div>
      </div>
    )
  }
}