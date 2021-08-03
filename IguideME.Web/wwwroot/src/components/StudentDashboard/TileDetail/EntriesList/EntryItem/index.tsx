import React, { Component } from "react";
import {TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";
import {Divider, Statistic} from "antd";
import GradeStatistic from "../../../../../containers/GradeStatistic";

export default class EntryItem extends Component<{
  submission: TileEntrySubmission,
  tileEntry: TileEntry
}> {
  render(): React.ReactNode {
    const { tileEntry, submission } = this.props;

    return (
      <div className={"tileEntry"}>
        <h2>{ tileEntry.title }</h2>
        <Divider style={{margin: '5px 0'}} />

        <GradeStatistic grade={submission.grade} />
      </div>
    )
  }
}