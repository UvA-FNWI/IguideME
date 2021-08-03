import React, { Component } from "react";
import StudentController from "../../../api/controllers/student";
import {Button, Checkbox, Col, Divider, Input, message, Row, Space} from 'antd';
import {CanvasStudent} from "../../../models/canvas/Student";
import Loading from "../../utils/Loading";
import "./style.scss";
import {IProps} from "./types";
import CSVReader from "react-csv-reader";
import ExternalDataController from "../../../api/controllers/externalData";
import StudentsGrid from "./StudentsGrid";

export default class UploadBinaryData extends Component<IProps> {

  state = {
    students: [], loaded: false, checked: [], query: ""
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({ students, loaded: true })
    );
  }

  handleFileUpload = (data: any[]) => {
    if (!ExternalDataController.validateData(data)) {
      message.error("Invalid data!");
      return;
    }

    const trueValues = data.filter(row => row.grade === '1');
    this.setState({ checked: trueValues.map(row => row.studentloginid )});
  }

  render(): React.ReactNode {
    const { students, loaded, checked, query } = this.state;

    if (!loaded) return <Loading small={true} />;

    return (
      <div id={"uploadBinaryData"}>
        <Divider />
        <Space direction={"vertical"} style={{width: '100%'}}>
          <Row gutter={[10, 10]}>
            <Col xs={5}>
              <label>Data Source</label><br />
              <label
                className={"uploadSource"}
                style={{ height: 'fit-content'}}
              >
                Upload data source
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
              <Input placeholder={"Title"} />
            </Col>
            <Col xs={12}>
              <label>Success label</label>
              <Input value={"Passed"} />
            </Col>
            <Col xs={12}>
              <label>Fail label</label>
              <Input value={"Failed"} />
            </Col>
          </Row>

          <Row gutter={[10, 10]}>
            <Col xs={24} md={12}>
              <Checkbox indeterminate={checked.length !== students.length && checked.length > 0}
                        onChange={() => {
                          if (checked.length < students.length) {
                            this.setState({ checked: students.map((s: CanvasStudent) => s.login_id)});
                          } else {
                            this.setState({ checked: []});
                          }
                        }}
                        checked={checked.length === students.length}>
                Check all
              </Checkbox>
            </Col>

            <Col xs={24} md={12}>
              <div style={{float: 'right', display: 'inline-block'}}>
                <span>
                  { checked.length } <small>/ {students.length} &nbsp;
                  ({ Math.round((checked.length / students.length) * 100)}%)</small>
                </span>
              </div>
            </Col>
          </Row>
        </Space>

        <Divider />
        <Input placeholder={"Find student by name"}
               autoComplete={"off"}
               autoCorrect={"off"}
               onChange={(e) => this.setState({ query: e.target.value })}
               value={query} />

        <StudentsGrid students={students}
                      checked={checked}
                      query={query}
                      setChecked={checked => this.setState({ checked })}
        />

        <Space>
          <Button onClick={this.props.closeUploadMenu}
                  className={"dangerButtonStyle"}
          >
            Cancel
          </Button>

          <Button className={"successButton"}>
            Upload
          </Button>
        </Space>
      </div>
    )
  }
}