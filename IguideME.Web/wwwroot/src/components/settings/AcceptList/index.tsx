import React, { Component } from "react";
import StudentController from "../../../api/controllers/student";
import {Button, Col, Divider, Row, Space, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {IProps, IState} from "./types";
import Loading from "../../utils/Loading";
import {CanvasStudent} from "../../../models/canvas/Student";
import "./style.scss";
import Swal from "sweetalert2";
import {RootState} from "../../../store";
import {CourseActions} from "../../../store/actions/course";
import {connect, ConnectedProps} from "react-redux";
import DataMartController from "../../../api/controllers/datamart";
import AppController from "../../../api/controllers/app";

const mapState = (state: RootState) => ({
  course: state.course,
});

const mapDispatch = {
  loadCourse: () => CourseActions.loadCourse()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

class AcceptList extends Component<PropsFromRedux & IProps, IState> {

  state = {
    loaded: false,
    students: [],
    enabled: false,
    accepted: []
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students => this.setState({ students, loaded: true }));

    DataMartController.getAcceptList().then(acceptList => {
      this.setState({ accepted: acceptList.filter(x => x.accepted).map(x => x.student_login_id) });
    });

    const { course } = this.props;
    if (course) {
      this.setState({ enabled: course.accept_list });
    }
  }

  isAccepted = (loginId: string) => {
    return (this.state.accepted as string[]).includes(loginId);
  }

  render(): React.ReactNode {
    const { loaded, students, enabled, accepted }: IState = this.state;

    if (!loaded) {
      return (
        <div id={"acceptList"}>
          <h2>Accept List</h2>
          <div className={"primaryContainer"}>
            <Loading small={true} />
          </div>
        </div>
      )
    }

    return (
      <div id={"acceptList"}>
        <h2>Accept List</h2>

        <div className={"primaryContainer"}>
          <span>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={enabled}
              onChange={val => {
                AppController.updateAcceptList(val).then(e =>
                  this.setState({ enabled: e }, () => this.props.loadCourse()));
              }}
            />
            &nbsp;
            If enabled only the students with explicit access may use the application. When disabled all enrolled students are able to use the application.
          </span>

          <Divider />

          <span>
            Accepted: { accepted.length } / { students.length } <small>({Math.round((accepted.length / students.length) * 100)}%)</small>
          </span>

          <br />

          <Space>
            <Button disabled={!enabled}>Select all</Button>
            <Button disabled={!enabled}>Deselect all</Button>
            <Button disabled={!enabled}
                    onClick={() => {
                      Swal.fire({
                        title: 'Percentage of students to accept',
                        input: 'number',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Randomize',
                        showLoaderOnConfirm: true,
                        preConfirm: (percentage) => {
                          const _p = parseInt(percentage);

                          if (_p < 10) {
                            return Swal.showValidationMessage(
                              `The acceptance percentage must be above 10%!`
                            )
                          }

                          if (_p > 100) {
                            return Swal.showValidationMessage(
                              `Percentages can't exceed 100%.`
                            )
                          }
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          const percentage = parseInt(result.value as unknown as string);
                          const n = Math.ceil(students.length * (percentage / 100));
                          const _a = students.sort(() => 0.5 - Math.random()).slice(0, n);
                          this.setState({ accepted: _a.map((s: CanvasStudent) => s.login_id) });

                          Swal.fire('Task completed!', '', 'success')
                        }
                      })
                    }}
            >
              Random assign
            </Button>
            <Button className={"successButtonStyle"}
                    disabled={!enabled}
                    onClick={() => {
                      DataMartController.createAcceptList(students.map(s => {
                        return {
                          student_login_id: s.login_id,
                          accepted: accepted.includes(s.login_id)
                        }
                      })).then(list => {
                        this.setState({
                          accepted: list.filter(x => x.accepted).map(x => x.student_login_id)
                        });
                        Swal.fire('Configuration saved!', '', 'success')
                      })
                    }}
            >
              Save
            </Button>
          </Space>

          <Divider />

          <div style={{ opacity: enabled ? 1 : 0.5}}>
            <Row>
              { students.sort((a, b) => a.name.localeCompare(b.name)).map((student: CanvasStudent) => (
                <Col xs={12} md={8} lg={6} xl={4}>
                  <div className={`student ${this.isAccepted(student.login_id) && "accepted"}`}
                       onClick={() => {
                         this.isAccepted(student.login_id) ?
                           this.setState({ accepted: accepted.filter(s => s !== student.login_id) }) :
                           this.setState({ accepted: [...accepted, student.login_id] })
                       }}
                  >
                    <span>{ student.name }</span>
                    <br />
                    <small>{ student.login_id }</small>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default connector(AcceptList);