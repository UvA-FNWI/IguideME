import React, { Component } from "react";
import {Divider, Switch, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import ConsentEditor from "./ConsentEditor";
import FadeIn from "react-fade-in";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import AppController from "../../../api/controllers/app";
import Loading from "../../utils/Loading";
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

class RequireConsent extends Component<PropsFromRedux, IState> {

  state = {
    loading: false
  }

  toggleConsentRequirement = () => {
    const { course } = this.props;

    if (!course) return;

    this.setState({ loading: true }, () => {
      AppController.updateConsent(!course.require_consent, course.text).then(() => {
        this.props.loadCourse().then(() => {
          this.setState({ loading: false });
        });
      });
    });
  }

  render(): React.ReactNode {
    const { course } = this.props;
    if (!course) return <Loading small={true} />;

    return (
      <div id={"informedConsent"}>
        <h2>Informed Consent</h2>
        <div className={"primaryContainer"}>
          <span>
            <Tooltip title={"Consent is mandatory!"}>
              <Switch
                // consent is enforced
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onClick={this.toggleConsentRequirement}
                checked={course.require_consent || true}
                disabled={true}
                loading={this.state.loading}
              />
            </Tooltip>
            &nbsp;
            When checked students are required to explicitly accept the informed consent. Students that did not grant
              consent won't be able to use the application and their data will be excluded.
          </span>

          <Divider />

          { course.require_consent &&
            <FadeIn>
              <ConsentEditor />
            </FadeIn>
          }
        </div>
      </div>
    )
  }
}

export default connector(RequireConsent);