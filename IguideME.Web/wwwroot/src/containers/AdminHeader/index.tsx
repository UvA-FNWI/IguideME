import React, { Component } from "react";
import Select from "react-select";
import {Button, Tooltip} from "antd";
import {SyncOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {IProps, IState} from "./types";
import StudentController from "../../api/controllers/student";
import {CanvasStudent} from "../../models/canvas/Student";
import {debug} from "../../config/config";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import "./style.scss";

const mapState = (state: RootState) => ({
  course: state.course,
  user: state.user
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = IProps & PropsFromRedux;

class AdminHeader extends Component<Props, IState> {

  state = {
    loaded: false,
    students: []
  }

  componentDidMount(): void {
    const { studentPickView } = this.props;

    if (studentPickView) {
      StudentController.getStudents().then(students => this.setState({ students, loaded: true }));
    }

    this.setState({ loaded: true });
  }

  renderInner(): React.ReactNode {
    if (this.props.studentPickView) {
      const { students, loaded } = this.state;
      return (
        <Select id={"studentPicker"}
                isLoading={!loaded}
                options={students.sort(
                  (a: CanvasStudent, b: CanvasStudent) => a.name.localeCompare(b.name)
                ).map((s: CanvasStudent) => ({ label: s.name, value: s.userID}))}
                placeholder={"Choose a student"}
                onChange={(e) => this.props.setStudent!(
                  e ? students.find((s: CanvasStudent) => s.userID === e!.value)! : null
                )}
                isClearable={true}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid white'
                  }),
                  singleValue: (provided, state) => {
                    return {...provided, color: 'white'};
                  }
                }}
        />
      );
    }

    return (
      <div id={"inner"}>
        <h2>{ this.props.course ? this.props.course.course_name : "Loading course..." }</h2>
      </div>
    );
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <div id={"adminHeader"}>
          { this.props.studentPickView ?
            <Link to={'/admin'} style={{ float: 'right' }}>
              <h3>Admin Panel</h3>
            </Link> :
            <div style={{float: 'right', padding: 20}}>
              <Tooltip title={"Reload data"}>
                <Button id={"reload"}
                        shape="circle"
                        style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', color: 'white'}}
                        icon={<SyncOutlined />} />
              </Tooltip>
            </div>
          }

          <div id={"navbarContent"}>
            <div id={"brand"}>
              <Link to={'/'}>
                <h1>IGuideME</h1>
              </Link>
            </div>

            { this.renderInner() }
          </div>
        </div>
        { debug() &&
          (<div id={"debugNotice"}>
            Application is running in <strong>demo</strong> mode. Changes will not be saved!
          </div>)
        }
      </React.Fragment>
    );
  }
}

export default connector(AdminHeader);
