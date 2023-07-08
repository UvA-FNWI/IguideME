import React, { Component } from 'react';
import {IProps, IState} from "./types";
import CreatableSelect from 'react-select/creatable';
import {Space, Table, Switch, Divider, Alert} from "antd";
import {QuestionOutlined} from "@ant-design/icons";
import {getColumns} from "./helpers";
import QuizzesTutorial from "./QuizzesTutorial";
import {IManagerProps} from "../types";
import "./style.scss";
import {editState, TileEntry} from "../../../../models/app/Tile";

type Props = IManagerProps & IProps;

export default class AssignmentManager extends Component<Props, IState> {

  state = {
    tutorialOpen: false,
  }

  addAssignment = (name: string) => {
    const { canvasAssignments, tile }: Props = this.props;
    const assignment = canvasAssignments.find(a => a.title === name);

    const entry: TileEntry = {
      id: -1,
      state: editState.new,
      tile_id: tile ? tile.id : -1,
      title: !assignment ? name : assignment.title,
      type: "ASSIGNMENT"
    };

    this.props.addEntry(entry);
  }

  render(): React.ReactNode {
    const { activeAssignments, canvasAssignments }: Props = this.props;
    console.log("activeAssignments", activeAssignments);
    console.log("canvasAssignments", canvasAssignments);

    return (
      <div id={"assignmentManager"}>
        <h2>Select assignments.</h2>
        <Divider />

        <Space direction={"vertical"} style={{width: '100%'}}>
          <QuizzesTutorial open={this.state.tutorialOpen} setOpen={(val) => this.setState({ tutorialOpen: val })} />
          <span>
            <Switch checked={this.props.graphView}
                    onChange={(val) => this.props.setGraphView(val)}
                    style={{zIndex: 0}}
            />
              &nbsp;
              <b>Enable graph view. </b>If enabled entries will be visualized using a graph instead of the tiles.
          </span>

          <Alert message={
            <span>
              <QuestionOutlined />
              &nbsp;
              <button onClick={() => this.setState({ tutorialOpen: true })} style={{background: "none", border: "none", padding: "0!important", cursor: 'pointer', color: '#069', textDecoration: 'underline'}}>
                  Create responsive quizzes.
                </button>
              {' '}
              Responsive quizzes are like surveys which can be used to poll the time spent on an assignment.
            </span>
          } type="info" />

          <div id={"assignmentRegistry"}>
            <Table columns={getColumns(this.props.removeEntry, canvasAssignments)}
                   pagination={false}
                   dataSource={activeAssignments} //.sort((a, b) => a.position - b.position)
            />
          </div>

          <div>
            <CreatableSelect
              options={canvasAssignments
                .filter(a => !activeAssignments.map(x => x.title).includes(a.title) )
                .map(a => ({ label: a.title, value: a.id }))}
              onCreateOption={(name: string) => this.addAssignment(name)}
              onChange={(e) => this.addAssignment(e!.label.toString())}
              value={null}
            />
          </div>
        </Space>
      </div>
    );
  }
}