import React, { Component } from "react";
import {IProps, IState} from "./types";
import TileController from "../../api/controllers/tile";
import {Table} from "antd";
import {getColumns, getData} from "./helpers";
import StudentController from "../../api/controllers/student";

export default class StudentGradesTable extends Component<IProps, IState> {

  state = {
    loaded: false,
    tiles: [],
    tileGroups: [],
    tileEntries: [],
    students: [],
    submissions: []
  }

  componentDidMount(): void {
    TileController.getTileGroups().then(async tileGroups => {
      this.setState({tileGroups});
    });
    TileController.getTiles().then(async tiles => {
      this.setState({tiles});
    });
    TileController.getEntries().then(async tileEntries => {
      this.setState({tileEntries});
    });
    StudentController.getStudents().then(async students => {
      this.setState({students});
    });
        TileController.getAllSubmissions().then(async submissions => {
      this.setState({submissions, loaded: true });
    });
  }

  render(): React.ReactNode {
    const { averaged } = this.props;
    const { tiles, tileEntries, students, submissions, loaded } = this.state;

    console.log("GRADE TABLE", submissions);
    console.log("COLUMNS", getColumns(tiles, tileEntries, averaged));
    console.log("DATA", getData(students, tiles, tileEntries, submissions));
    return (
      <div id={"studentsGradeTable"} style={{position: 'relative', overflow: 'visible'}}>
        <Table columns={getColumns(tiles, tileEntries, averaged)}
               dataSource={getData(students, tiles, tileEntries, submissions)}
               scroll={{ x: 900 }}
               bordered
               sticky={true}
        />
      </div>
    );
  }
}