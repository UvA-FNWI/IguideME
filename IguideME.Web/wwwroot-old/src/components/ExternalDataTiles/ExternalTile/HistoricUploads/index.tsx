import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Table, Drawer} from "antd";
import {formatData, getColumns} from "./helpers";
import {TileEntry} from "../../../../models/app/Tile";
import "./style.scss";
import DataViewer from "./DataViewer";

export default class HistoricUploads extends Component<IProps, IState> {

  state = {
    drawerOpen: false,
    openEntry: undefined,
  }

  render(): React.ReactNode {
    const {
      drawerOpen,
      openEntry,
    }: IState = this.state;

    const { tile, entries, submissions, students } = this.props;

    return (
      <div className={"historicUploads"}>
        <Drawer width={'100%'} open={drawerOpen && openEntry} onClose={() => this.setState({ drawerOpen: false })}>
          { students.length } students
          <DataViewer tileEntry={openEntry}
                      students={students}
                      submissions={submissions.filter(s => s.entry_id === (openEntry ? (openEntry as TileEntry)!.id : false))}
          />
        </Drawer>

        <h3>Historic Uploads</h3>
        <Table columns={getColumns((entry: TileEntry) => {
                 this.setState({ drawerOpen: true, openEntry: entry })
               }, () => this.props.reload())}
               scroll={{ x: 1000 }}
               dataSource={formatData(tile, entries, submissions)}
        />
      </div>
    );
  }
}
