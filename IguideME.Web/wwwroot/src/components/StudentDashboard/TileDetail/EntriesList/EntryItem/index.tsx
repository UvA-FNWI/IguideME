import React, { Component } from "react";
import {TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";
import {Divider, Statistic, Table} from "antd";
import GradeStatistic from "../../../../../containers/GradeStatistic";

export default class EntryItem extends Component<{
  submission: TileEntrySubmission,
  tileEntry: TileEntry
}> {
  render(): React.ReactNode {
    const { tileEntry, submission } = this.props;

    // TODO: I suspect that in the demo, meta is a json object. But in production, it is an object. Investigate.
    /*     const meta = JSON.parse(submission.meta || "{}"); */
    const meta = submission.meta || {};

    return (
      <div className={"tileEntry"}>
        <h2>{ tileEntry.title }</h2>
        <Divider style={{margin: '5px 0'}} />

        <GradeStatistic grade={submission.grade} />

        { Object.keys(meta).length > 0 &&
          <div>
            <Table dataSource={Object.keys(meta).map((key, i) => ({
              key: i,
              label: key,
              value: meta[key]
            }))} columns={[
              {
                title: 'Key',
                dataIndex: 'label',
                key: 'label',
                width: '40%',
                ellipsis: true
              },
              {
                title: 'Value',
                dataIndex: 'value',
                key: 'value',
              }]} />
          </div>
        }
      </div>
    )
  }
}
