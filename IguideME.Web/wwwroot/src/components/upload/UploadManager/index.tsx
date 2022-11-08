import React, { Component } from "react";
import {IProps, IState} from "./types";
import UploadBinaryData from "./UploadBinaryData";
import UploadEntriesData from "./UploadEntriesData";
import {Button, Col, Input, message, Row, Space} from "antd";
import CSVReader from "react-csv-reader";
import ExternalDataController from "../../../api/controllers/externalData";
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
    title: ""
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({
        students: students.sort((a, b) => a.name.localeCompare(b.name)),
        loaded: true })
    );
  }

  handleFileUpload = (data: any[]) => {
    if (!ExternalDataController.validateData(data)) {
      message.error("Invalid data!");
      return;
    }

    this.setState({ data });
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
        TileController.uploadData(entry.id, data).then(() => {
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
    const { students, data, title, uploading } = this.state;

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
                             header: true,
                             dynamicTyping: false,
                             skipEmptyLines: true,
                             transformHeader: header =>
                               header
                                 .toLowerCase()
                                 .replace(/\W/g, '_')
                           }}
                />
              </label>
            </Col>
            <Col xs={19}>
              <label>Entry title</label>
              <Input placeholder={"Title"} value={title} onChange={e => this.setState({ title: e.target.value })} />
            </Col>
            <Col xs={24}>
              <strong id={"notice"}>Notice: each upload <u>must</u> contain a column named <i>StudentLoginID</i> specifying the student's login id. There must also be a column named <i>Grade</i>. All other columns will be stored as meta attributes to the submission.</strong>
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