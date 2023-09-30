import React from "react";
import ConsentController from "../api/controllers/consent";
import Loading from "../components/utils/Loading";
import {store} from "../utils/configureStore";
import App from "../common/App";

type IState = {
  accepted: boolean;
  consentLoaded: boolean;
  consentGranted: boolean | null;
}

export const withConsent = <P extends object>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P, IState> {

    state = {
      accepted: false,
      consentLoaded: false,
      consentGranted: false
    }

    componentDidMount(): void {
      ConsentController.fetchConsent().then(result => {
        ConsentController.isAccepted().then(accepted => {
          // console.log(result)
          this.setState({
            accepted,
            consentLoaded: true,
            consentGranted: result === 1
          });
        });
      });
    }

    render() {
      const { consentLoaded, consentGranted, accepted } = this.state;

      const { course } = store.getState();

      if (!consentLoaded || !course) return <Loading />;

      if (!consentGranted && course.require_consent) {
        return <App consent={course.text} />;
      }

      if (!accepted) {
        return (
          <div>
            <h2>You are not authorized to use this application.</h2>
          </div>
        )
      }

      return <Component {...this.props as P} />;
    }
  };
