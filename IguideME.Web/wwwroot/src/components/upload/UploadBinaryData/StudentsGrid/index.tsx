import React, { Component } from "react";
import {IProps} from "./types";
import {Checkbox, Col, Row} from "antd";
import {CanvasStudent} from "../../../../models/canvas/Student";

export default class StudentsGrid extends Component<IProps> {
  render(): React.ReactNode {
    const { students, checked, query, setChecked } = this.props;

    return (
      <div>
        <Checkbox.Group value={checked}>
          <Row>
            { students.sort(
              (a: CanvasStudent, b: CanvasStudent) => a.name.localeCompare(b.name)
            ).map(
              (student: CanvasStudent) => (
                <Col xs={12} md={8} lg={6} className={"student"}>
                  <Checkbox key={student.login_id}
                            value={student.login_id}
                            checked={(checked as string[]).includes(student.login_id)}
                            onChange={() => {
                              if (!(checked as string[]).includes(student.login_id))
                                setChecked([...checked, student.login_id]);
                              else
                                setChecked(checked.filter(c => c !== student.login_id));
                            }}
                  >
                    <span className={(query.length > 0 && student.name.toLowerCase().includes(query.toLowerCase())) ? "highlight" : ""}>
                      { student.name } <small>({ student.login_id })</small>
                    </span>
                  </Checkbox>
                </Col>
              )
            )}
          </Row>
        </Checkbox.Group>
      </div>
    );
  }
}