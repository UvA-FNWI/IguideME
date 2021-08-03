import React from "react";
import ConsentController from "../api/controllers/consent";
import Loading from "../components/utils/Loading";

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
      const { consentLoaded } = this.state;

      if (!consentLoaded) return <Loading />;

      return <Component {...this.props as P} />;
    }
  };