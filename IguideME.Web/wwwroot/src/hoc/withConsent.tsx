import React from "react";
import ConsentController from "../api/controllers/consent";
import Loading from "../components/utils/Loading";
import Consent from "../common/Consent";
import {store} from "../utils/configureStore";

type IState = {
  consentLoaded: boolean;
  consentGranted: boolean | null;
}

export const withConsent = <P extends object>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P, IState> {

    state = {
      consentLoaded: false,
      consentGranted: false
    }

    componentDidMount(): void {
      ConsentController.fetchConsent().then(result => {
        this.setState({
          consentLoaded: true,
          consentGranted: result === 1
        });
      });
    }

    render() {
      const { consentLoaded, consentGranted } = this.state;

      const { course } = store.getState();

      if (!consentLoaded || !course) return <Loading />;

      if (!consentGranted && course.require_consent) {
        return <Consent text={course.text} />;
      }

      return <Component {...this.props as P} />;
    }
  };