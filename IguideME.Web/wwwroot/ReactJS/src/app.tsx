import React from "react";
import ConsentController from "./api/consent";
import {IBackendResponse} from "./models/IBackendResponse";
import {setConsent} from "./store/actions/consent";
import Loading from "./components/Loading";
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Consent from "./components/Consent";
import App from "./common/App";
import {RootState} from "./store";
import {Alert} from "antd";
import Admin from "./common/Admin";


class IguideME extends React.Component<any, any> {

  componentDidMount(): void {
    const { dispatch } = this.props;

    ConsentController.fetchConsent().then((response: IBackendResponse) => {
      const { data } = response;

      switch (data) {
        case 1:
          dispatch(setConsent(true));
          break;
        case 0:
          dispatch(setConsent(false));
          break;
        default:
          dispatch(setConsent(null));
          break;
      }
      this.forceUpdate();
    }).catch(() => { dispatch(setConsent(null)); this.forceUpdate() });
  }

  render(): React.ReactNode {

    if (!this.props.consent) {
      return <Loading />;
    }

    if (this.props.consent.granted === false) {
      return (
        <div>
          <Alert
            message="Consent not granted"
            description="You have denied consent in the past. If you wish to participate you can grant consent below."
            type="info"
            showIcon
          />
          <Consent />
        </div>
      )
    }

    if (this.props.adminView) {
      return <Admin />;
    }

    return (
      this.props.consent.granted === null ?
        <Consent /> :
        <Router>
          <Switch>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/consent">
              <Consent />
            </Route>
            <Route path="/">
              <App />
            </Route>
          </Switch>
        </Router>
    )
  }
}

export default connect((state: RootState) => ({
  consent: state.consent,
  adminView: state.adminView
}))(IguideME);