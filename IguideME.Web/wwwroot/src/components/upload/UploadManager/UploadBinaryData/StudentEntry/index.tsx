import React, { Component } from "react";
import {Checkbox, Col} from "antd";
import {IProps} from "./types";

export default class StudentEntry extends Component<IProps> {

  isHighlighted = () => {
    const { query, student } = this.props;
    if (query.length === 0) return false;

    return student.name.toLowerCase().includes(query.toLowerCase());
  }

  render(): React.ReactNode {
    const { student, studentRecord, query } = this.props;

    return (
      <Col xs={12} md={8} lg={6} className={"student"}>
        <Checkbox key={student.login_id}
                  value={student.login_id}
                  checked={studentRecord ? studentRecord['grade'] > 0 : false}
                  onChange={e => {
                    this.props.updateStudent(
                      student.login_id, {studentloginid: student.login_id, grade: e.target.checked ? 1 : 0 }
                    );
                  }}
        >
          <span className={"studentName " + (this.isHighlighted() ? "highlight" : "")}>
            { student.name } <small>({ student.login_id })</small>
          </span>
        </Checkbox>
      </Col>
    )
  }
}