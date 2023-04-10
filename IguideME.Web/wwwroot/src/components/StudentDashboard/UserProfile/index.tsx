import React, { Component } from "react";
import {Button, Col, Row} from "antd";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {CanvasStudent} from "../../../models/canvas/Student";
import DataMartController from "../../../api/controllers/datamart";
import {PerformanceNotification} from "../../../models/app/Notification";
import PerformanceNotifications from "../../../components/visuals/Notifications";
import { SettingOutlined } from "@ant-design/icons";

const mapState = (state: RootState) => ({
  course: state.course,
  tiles: state.tiles
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { student: CanvasStudent | undefined , settings: (view: boolean) => void};
type IState = { notifications: PerformanceNotification[] };

class UserProfile extends Component<Props, IState> {

  _isMounted = false;

  state = {
    notifications: []
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.loadNotifications(this.props);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.student?.userID !== this.props.student?.userID) {
      this.loadNotifications(nextProps);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadNotifications = (props: Props) => {
    const { student } = props;
    if (!student) return;

    DataMartController.getNotifications(student.userID).then(notifications => {
      // TODO: I think this may be a race condition, try to do away with the isMounted flag and resolve the console error. If noone complains about missing functionality by 2023, remove this todo.
      this._isMounted && this.setState({ notifications });
    });
  }

  render(): React.ReactNode {
    const { course, student, tiles, settings } = this.props;
    const { notifications }: IState = this.state;

    const outperforming = notifications
      .filter(n => n.status === "outperforming peers");

    const closing = notifications
      .filter(n => n.status === "closing the gap");

    const moreEffort = notifications
      .filter(n => n.status === "more effort required");

    return (
      <div id={"userProfile"}>
        <Row justify={"space-around"} gutter={[0, 20]}>
          <Col >
            <div >
            <h3>{ student && student.name }</h3>
            <strong>{ course && course.course_name }</strong>
            </div>
          </Col>

          <Col >
              <PerformanceNotifications outperforming = {outperforming}
                                      closing = {closing}
                                      moreEffort = {moreEffort}
                                      tiles = {tiles}
            />
          </Col>
          <Col >
            <Button size={"large"} onClick={() => settings(true)} color={"primary"} icon={<SettingOutlined />}>
              Settings
            </Button>
          </Col>

        </Row>
        <br />
        <div style={{textAlign: 'center'}}>
          <small>
            IguideME is a product by the University of Amsterdam.
          </small>
        </div>
      </div>
    )
  }
}

export default connector(UserProfile);
