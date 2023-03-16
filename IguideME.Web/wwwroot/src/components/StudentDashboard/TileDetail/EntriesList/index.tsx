import React, { Component } from "react";
import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {Col, Row} from "antd";
import EntryItem from "./EntryItem";
import {Bar} from "react-chartjs-2";
import "./style.scss";
import {CanvasDiscussion} from "../../../../models/canvas/Discussion";

export default class EntriesList extends Component<{
  submissions: TileEntrySubmission[],
  tileEntries: TileEntry[],
  discussions: CanvasDiscussion[],
  tile: Tile
}> {

  barOptions = {
    maintainAspectRatio: true, ///// THIS WASN'T HERE BEFORE
    legend: { 
      display: false 
    }
  }

  render(): React.ReactNode {
    const { tile, tileEntries, submissions } = this.props;

    if (tile.graph_view) {
      const data = {
        labels: submissions.map((s, i) => {
          const entry = tileEntries.find(e => e.id === s.entry_id);
          return entry?.title ?? "???";
        }),
        datasets: [
          {
            label: tile.title + " grades",
            data: submissions.map(s => s.grade),
            fill: false,
            backgroundColor: "rgba(75,192,192,1)"
          }
        ]
      };

      return (
        <div id={"tileEntriesGraph"} style={{minHeight: '60vh'}}>
          <div>
            <Bar  options={this.barOptions}
                  width={500}
                  data={data} />
          </div>
        </div>
      );
    }

    return (
      <div id={"tileEntriesList"}>
        <Row gutter={[10, 10]}>
          { tileEntries.map(entry => {
            const submission = submissions.find(s => s.entry_id === entry.id);
            if (!submission) return null;

            return (
              <Col key={entry.id} xs={24} sm={12} md={8} lg={6} className={"entryCol"}>
                <EntryItem submission={submission} tileEntry={entry} />
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}
