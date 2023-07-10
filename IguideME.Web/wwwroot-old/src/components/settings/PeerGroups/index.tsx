import React, { Component } from "react";
import {Button, InputNumber, Space, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import AppController from "../../../api/controllers/app";
import {IState} from "./types";
import {CourseActions} from "../../../store/actions/course";

const mapState = (state: RootState) => ({
  course: state.course,
});

const mapDispatch = {
  loadCourse: () => CourseActions.loadCourse()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

class PeerGroups extends Component<PropsFromRedux, IState> {

  state = {
    loading: true,
    enabled: false,
    size: 0,
    inputSize: 0,
    inputEnabled: false,
    buttonText: "Save"
  }

  componentDidMount(): void {
    this.setState({ loading: true }, () => {
      AppController.getCoursePeerGroups().then(result => {
        this.setState({
          loading: false,
          enabled: result.personalized_peers,
          inputEnabled: result.personalized_peers,
          size: result.min_size,
          inputSize: result.min_size
        })
      });
    });
  }

  updatePeerGroups = (personalized: boolean = false) => {
    this.setState({ loading: true }, () => {
      AppController.updateCoursePeerGroup(
        this.state.inputSize,
        personalized ? true : this.state.inputEnabled
      ).then(result => {
        this.setState({
          enabled: result.personalized_peers,
          inputEnabled: result.personalized_peers,
          size: result.min_size,
          inputSize: result.min_size,
          buttonText: "Saved"
        }, () => {
          setTimeout(() => this.setState({ buttonText: "Save", loading: false }), 1000)
        });
      });
    });
  }

  render(): React.ReactNode {
    return (
      <div id={"peerGroups"}>
        <h2>Peer Groups</h2>
        <div className={"primaryContainer"}>
          <Space direction={"vertical"}>
            <div>
              <span>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onClick={() => {
                    this.updatePeerGroups(!this.state.inputEnabled);
                    this.setState({ inputEnabled: !this.state.inputEnabled });
                  }}
                  checked={this.state.inputEnabled}
                  loading={this.state.loading}
                />
                &nbsp;
                Enable personalized peer groups.
              </span>
            </div>

            <div>
              Minimum group size: &nbsp;
              <InputNumber min={2}
                           size={"large"}
                           value={this.state.inputSize}
                           onChange={val => this.setState({ inputSize: val as number })}
                           disabled={!this.state.enabled || this.state.loading} />
            </div>

            <Button className={"successButtonStyle"}
                    onClick={() => this.updatePeerGroups()}
                    loading={this.state.loading}
                    disabled={this.state.loading}>
              { this.state.buttonText }
            </Button>
          </Space>
        </div>
      </div>
    )
  }
}

export default connector(PeerGroups);