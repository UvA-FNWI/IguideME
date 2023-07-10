import React, { Component } from "react";
import {IProps, IState} from "./types";
import TileController from "../../api/controllers/tile";
import {Col, Row, Switch, Table} from "antd";
import {getColumns, getData} from "./helpers";
import StudentController from "../../api/controllers/student";
import CanvasController from "../../api/controllers/canvas";

export default class StudentGradesTable extends Component<IProps, IState> {

  state = {
    averaged: false,
    loaded: false,
    tiles: [],
    tileGroups: [],
    tileEntries: [],
    discussions: [],
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

    CanvasController.getDiscussions().then(async discussions => {
      this.setState({discussions});
    });

    TileController.getAllSubmissions().then(async submissions => {
      this.setState({submissions, loaded: true });
    });
  }

  render(): React.ReactNode {
    const { averaged, tiles, tileEntries, discussions, students, submissions } = this.state;

    return (
      <div id={"studentsGradeTable"} style={{position: 'relative', overflow: 'visible'}}>

        <Row justify={"space-between"} align={"bottom"} style={{paddingBottom: '10px'}}>
          <Col>
              <h2>Grades Overview</h2>
          </Col>
          <Col  >
              Averaged: &ensp; <Switch onClick={e => this.setState({ averaged: e })} checked={averaged} />
          </Col>
        </Row>

        <Table columns={getColumns(tiles, tileEntries, averaged)}
               dataSource={getData(students, tiles, tileEntries, submissions, discussions)}
               scroll={{ x: 900 }}
               bordered
               sticky={true}
        />
      </div>
    );
  }
}
