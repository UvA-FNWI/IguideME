import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Table, Drawer} from "antd";
import {formatData, getColumns} from "./helpers";
import TileController from "../../../../api/controllers/tile";
import {TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import "./style.scss";
import DataViewer from "./DataViewer";
import StudentController from "../../../../api/controllers/student";

export default class HistoricUploads extends Component<IProps, IState> {

  state = {
    loaded: false,
    tiles: [],
    entries: [],
    submissions: [],
    drawerOpen: false,
    openEntry: undefined,
    students: []
  }

  componentDidMount(): void {
    const { id } = this.props.tile;
    // step 1: fetch all students
    StudentController.getStudents().then(students => {
      // step 2: retrieve all tiles
      TileController.getTiles().then(tiles => {
        // step 4: get entries per tile
        TileController.getTileEntries(id).then(async entries => {
          const filteredEntries = entries.filter(e => e.tile_id === id);
          let tileSubmissions: TileEntrySubmission[] = [];

          // step 5: get submissions per tile
          for (const entry of filteredEntries) {
            const entrySubmissions = await TileController.getEntrySubmissions(entry.id).then(v => v);
            tileSubmissions.push(...entrySubmissions);
          }

          this.setState({ loaded: true, entries, tiles, submissions: tileSubmissions, students });
        });
      });
    });
  }

  render(): React.ReactNode {
    const {
      loaded,
      tiles,
      entries,
      submissions,
      drawerOpen,
      openEntry,
      students
    }: IState = this.state;

    return (
      <div className={"historicUploads"}>
        <Drawer width={'100%'} visible={drawerOpen && openEntry} onClose={() => this.setState({ drawerOpen: false })}>
          <DataViewer tileEntry={openEntry}
                      students={students}
                      submissions={submissions.filter(s => s.entry_id === (openEntry ? openEntry!.id : false))}
          />
        </Drawer>

        <h3>Historic Uploads</h3>
        <Table loading={!loaded}
               columns={getColumns((entry: TileEntry) => {
                 this.setState({ drawerOpen: true, openEntry: entry })
               })}
               scroll={{ x: 1000 }}
               dataSource={formatData(tiles, entries, submissions)}
        />
      </div>
    );
  }
}