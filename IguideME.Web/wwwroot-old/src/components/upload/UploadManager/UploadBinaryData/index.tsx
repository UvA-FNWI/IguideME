import React, { Component } from "react";
import StudentController from "../../../../api/controllers/student";
import {Checkbox, Col, Input, Row} from 'antd';
import Loading from "../../../utils/Loading";
import {IUploadProps} from "../types";
import "./style.scss";
import StudentEntry from "./StudentEntry";

export default class UploadBinaryData extends Component<IUploadProps> {

  state = {
    loaded: false, query: ""
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({ students, loaded: true })
    );
  }

  updateStudent = (userID: string, record: any) => {
    this.props.setData(
      [...this.props.data.filter(d => d.userID !== userID), record]
    );
  }

  render(): React.ReactNode {
    const { loaded, query } = this.state;
    const { data, students } = this.props;

    if (!loaded) return <Loading small={true} />;

    return (
      <div id={"uploadBinaryData"}>
        <Row gutter={[10, 10]}>
          <Col xs={24} md={12}>
            <Checkbox indeterminate={data.filter(d => d.grade > 0).length !== students.length && data.filter(d => d.grade > 0).length > 0}
                      onChange={() => {
                        if (data.filter(d => d.grade > 0).length < students.length) {
                          this.props.setData(students.map(s => ({userID: s.userID, grade: 1})));
                        } else {
                          this.props.setData(students.map(s => ({userID: s.userID, grade: 0})));
                        }
                      }}
                      checked={data.filter(d => d.grade > 0).length === students.length}>
              <span style={{color: 'white'}}>Check all</span>
            </Checkbox>
          </Col>

          <Col xs={24} md={12}>
            <div style={{float: 'right', display: 'inline-block'}}>
                <span>
                  { data.filter(d => d.grade > 0).length } <small>/ {students.length} &nbsp;
                  ({ Math.round((data.filter(d => d.grade > 0).length / students.length) * 100)}%)</small>
                </span>
            </div>
          </Col>
        </Row>

        <Input placeholder={"Find student by name"}
               autoComplete={"off"}
               autoCorrect={"off"}
               onChange={(e) => this.setState({ query: e.target.value })}
               value={query} />

        <Row>
          { students.map(s => (
            <StudentEntry student={s}
                          query={query}
                          updateStudent={this.updateStudent}
                          studentRecord={data.find(d => d.userID === s.userID)}
            />
          ))}
        </Row>

      </div>
    )
  }
}
