import React, { Component } from "react";
import {IProps, IState} from "./types";
import UploadBinaryData from "./UploadBinaryData";
import UploadEntriesData from "./UploadEntriesData";
import {Button, Col, Input, InputNumber, message, Row, Space} from "antd";
import CSVReader from "react-csv-reader";
// import ExternalDataController from "../../../api/controllers/externalData"; TODO: move communication with backend to this controller or remove it.
import StudentController from "../../../api/controllers/student";
import TileController from "../../../api/controllers/tile";
import "./style.scss";
import { editState } from "../../../models/app/Tile";

export default class UploadManager extends Component<IProps, IState> {

  state = {
    loaded: false,
    uploading: false,
    students: [],
    data: [],
    title: "",
    id_column: 0,
    grade_column: 1
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({
        students: students.sort((a, b) => a.name.localeCompare(b.name)),
        loaded: true })
    );
  }

  handleFileUpload = (data: any[]) => {
    console.log("data", data);
    this.setState({ data });
  }

  changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    this.setState({title});
  }

  changeIDColumn = (nr: number | null) => {
    this.setState({id_column: nr ? nr : 0});
  }

  changeGradeColumn = (nr: number | null) => {
    this.setState({grade_column: nr ? nr : 0});
  }

  upload = () => {
    const { tile } = this.props;
    const { data, title } = this.state;

    this.setState({ uploading: true }, () => {
      TileController.createTileEntry({
        id: -1,
        state: editState.new,
        tile_id: tile.id,
        title,
        type: "ASSIGNMENT"
      }).then(entry => {
        TileController.uploadData(entry.id, 0, 1, data).then(() => {
          setTimeout(() => {
            message.success("Data uploaded!");
            this.props.closeUploadMenu();
            this.props.reload();
          }, 200)
        });
      });
    });
  }

  render(): React.ReactNode {
    const { tile } = this.props;
    const { students, data, title, uploading, id_column, grade_column} = this.state;

    return (
      <div id={"uploadManager"}>
        <Space direction={"vertical"} style={{width: '100%'}}>
          <Row gutter={[10, 10]}>
            <Col xs={5}>
              <label>Data Source</label><br />
              <label
                className={"uploadSource"}
                style={{ height: 'fit-content'}}
              >
                Upload data source (.CSV)
                <CSVReader onFileLoaded={(data) => this.handleFileUpload(data)}
                           inputStyle={{ display: 'none' }}
                           onError={() => alert("error")}
                           parserOptions={{
                             header: false,
                             dynamicTyping: false,
                             skipEmptyLines: true,
                             transformHeader: (header: any) =>
                               header
                                 .toLowerCase()
                                 .replace(/\W/g, '_')
                           }}
                />
              </label>
            </Col>
            <Col xs={19}>
              <label>Entry title</label>
              <Input placeholder={"Title"} value={title} onChange={this.changeTitle} />
            </Col>
          </Row>
          <Row>
            <Col>
             Column with student ids: <InputNumber min={0} value={id_column} onChange={this.changeIDColumn}/>
             Column with grads<InputNumber min={0} value={grade_column} onChange={this.changeGradeColumn}/>
            </Col>
          </Row>
          <div>
            { tile.content === "BINARY" ?
              <UploadBinaryData data={data}
                                setData={d => this.setState({ data: d })}
                                students={students} /> :
              <UploadEntriesData data={data}
                                 setData={d => this.setState({ data: d })}
                                 students={students} />
            }
          </div>
        </Space>

        <Space>
          <Button onClick={this.props.closeUploadMenu}
                  className={"dangerButtonStyle"}
          >
            Cancel
          </Button>

          <Button className={"successButton"}
                  onClick={this.upload}
                  loading={uploading}
                  disabled={title.length < 1}>
            Upload
          </Button>
        </Space>
      </div>
    )
  }
}
