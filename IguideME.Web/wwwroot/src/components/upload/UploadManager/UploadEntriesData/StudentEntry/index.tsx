import React, { Component } from "react";
import {Button, Col, Input, InputNumber, Row, Space} from "antd";
import {DownOutlined, UpOutlined, DeleteOutlined} from "@ant-design/icons";
import {IProps} from "./types";

export default class StudentEntry extends Component<IProps> {

  state = {
    menuOpen: false,
    key: "",
    value: ""
  }

  render(): React.ReactNode {
    const { student, studentRecord } = this.props;
    const { menuOpen, key, value } = this.state;

    const metaKeys = studentRecord ?
      Object.keys(studentRecord).filter(k => !['studentloginid', 'grade'].includes(k)) :
      []

    return (
      <Col xs={24} md={12}>
        <div style={{padding: 10, border: '1px solid #EAEAEA'}}>
          <Row gutter={[10, 10]}>
            <Col xs={12} md={16}>
              <strong>{ student.name }</strong>
            </Col>
            <Col xs={12} md={8}>
              <InputNumber size="small"
                           min={1}
                           max={10}
                           onChange={(e) => {
                             this.props.updateStudent(
                               student.login_id, {...studentRecord, studentloginid: student.login_id, grade: e }
                             );
                           }}
                           value={studentRecord ? studentRecord['grade'] : undefined} />
            </Col>

            <Col xs={24}>
              <div className={"metaAttributes"}>
                <Button icon={menuOpen ? <UpOutlined /> : <DownOutlined />}
                        size={"small"}
                        shape={"circle"}
                        onClick={() => this.setState({ menuOpen: !menuOpen })}
                        style={{float: 'right'}} />
                <small>Meta Attributes</small>
                <br />

                {menuOpen &&
                  <React.Fragment>
                    <div>
                      { metaKeys.sort((a, b) => a.localeCompare(b)).map(k => (
                        <div>
                          <Button icon={<DeleteOutlined />}
                                  size={"small"}
                                  style={{color: "#EAEAEA"}}
                                  type={"text"}
                                  onClick={() => {
                                    let record = JSON.parse(JSON.stringify(studentRecord));
                                    delete record[k];
                                    this.props.updateStudent(
                                      student.login_id,record
                                    );
                                  }}
                          />
                          {k}: {studentRecord[k]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <Row gutter={[10, 10]}>
                        <Col xs={10}>
                          <Input placeholder={"Key"}
                                 onChange={e => this.setState({ key: e.target.value })}
                                 value={key} />
                        </Col>
                        <Col xs={10}>
                          <Input placeholder={"Value"}
                                 onChange={e => this.setState({ value: e.target.value })}
                                 value={value} />
                        </Col>
                        <Col xs={4}>
                          <Button type={"primary"}
                                  block
                                  disabled={key.length === 0 || value.length === 0}
                                  onClick={() => {
                                    this.props.updateStudent(
                                      student.login_id,
                                      {...studentRecord,
                                        [key]: value,
                                        studentloginid: student.login_id,
                                      });
                                    this.setState({ key: "", value: "" });
                                  }}>
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </React.Fragment>
                }
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    )
  }
}