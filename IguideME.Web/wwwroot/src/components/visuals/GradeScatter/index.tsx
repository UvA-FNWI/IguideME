import React, { Component } from "react";
import { Scatter } from "react-chartjs-2";
import { createScatterData, getScatterOptions } from "./helpers";
import { IProps } from "./types";

export default class GradeScatter extends Component<IProps> {

  render(): React.ReactNode {
    const { entryOne, entryTwo, mergedData }: IProps = this.props;

    return (
      <div style={{
        width: '100%', height: '30vw', padding: 20, margin: '0 auto', textAlign: 'center'
      }}>
        <Scatter data={createScatterData(mergedData)} options={getScatterOptions(entryOne, entryTwo, mergedData)} />
      </div>
    );
  }
}