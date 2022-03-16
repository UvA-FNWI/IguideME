import React, { Component } from "react";
import {Link} from "react-router-dom";
import {Button, Col, Divider, Row} from "antd";
import {TrophyOutlined, RiseOutlined, WarningOutlined} from "@ant-design/icons";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {CanvasStudent} from "../../../models/canvas/Student";
import DataMartController from "../../../api/controllers/datamart";
import {PerformanceNotification} from "../../../models/app/Notification";

const mapState = (state: RootState) => ({
  course: state.course,
  tiles: state.tiles
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { student: CanvasStudent | undefined };
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
    if (nextProps.student?.login_id !== this.props.student?.login_id) {
      this.loadNotifications(nextProps);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadNotifications = (props: Props) => {
    const { student } = props;
    if (!student) return;

    DataMartController.getNotifications(student.login_id).then(notifications => {
      // TODO: I think this may be a race condition, try to do away with the isMounted flag and resolve the console error. If noone complains about missing functionality by 2023, remove this todo.
      this._isMounted && this.setState({ notifications });
    });
  }

  _getTileTitle = (tileID: number): string => {
    const { tiles } = this.props;

    return tiles.find(t => t.id === tileID)?.title ?? "";
  }

  render(): React.ReactNode {
    const { course, student, tiles } = this.props;
    const { notifications }: IState = this.state;

    const outperforming = notifications
      .filter(n => n.status === "outperforming peers")
      .sort((a, b) => {
        return this._getTileTitle(a.tile_id).localeCompare(this._getTileTitle(b.tile_id));
      });

    const closing = notifications
      .filter(n => n.status === "closing the gap")
      .sort((a, b) => {
        return this._getTileTitle(a.tile_id).localeCompare(this._getTileTitle(b.tile_id));
      });

    const moreEffort = notifications
      .filter(n => n.status === "more effort required")
      .sort((a, b) => {
        return this._getTileTitle(a.tile_id).localeCompare(this._getTileTitle(b.tile_id));
      });

    return (
      <div id={"userProfile"}>
        <Row>
          <Col xs={24} style={{textAlign: 'center'}}>
            <Link to={'/goal-grade'}>
              <Button size={"large"} color={"primary"}>
                Goal Grade
              </Button>
            </Link>
          </Col>

          <Col xs={24} md={8} lg={6}>
            <h3>{ student && student.name }</h3>
            <strong>{ course && course.course_name }</strong>
          </Col>

          <Col xs={24} md={0}>
            <Divider />
          </Col>

          <Col xs={24} md={16} lg={18}>
            { outperforming.length > 0 &&
              <div>
                <TrophyOutlined />
                {' '}
                You are outperforming your peers in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                  { outperforming.map((n, i) => <li key={i}>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
              </div> }

            { closing.length > 0 &&
              <div>
                <RiseOutlined />
                {' '}
                You are closing the gap to your peers in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                  { closing.map((n, i) => <li key={i}>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
              </div> }

            { moreEffort.length > 0 &&
              <div>
                <WarningOutlined />
                {' '}
                You have to put more effort in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                  { moreEffort.map(n => <li>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
              </div> }

            <div style={{textAlign: 'right'}}>
              <Link to={'/consent'}>Informed Consent</Link>
            </div>
          </Col>
        </Row>
        <br />
        <div style={{textAlign: 'center'}}>
          <small>
            IGuideME is a product by the University of Amsterdam.
          </small>
        </div>
      </div>
    )
  }
}

export default connector(UserProfile);
