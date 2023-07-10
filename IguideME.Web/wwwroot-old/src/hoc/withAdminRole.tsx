import React from "react";
import Loading from "../components/utils/Loading";
import AdminController from "../api/controllers/admin";

type IState = {
  isAdmin: boolean,
  doneLoading: boolean
}

export const withAdminRole = <P extends object>(Component: React.ComponentType<P>) =>
  class WithAdminRole extends React.Component<P, IState> {

    state = {
      isAdmin: false,
      doneLoading: false
    }

    componentDidMount(): void {
      AdminController.isAdmin().then(result => {
        this.setState({
          isAdmin: result,
          doneLoading: true
        });
      });
    }

    render() {
      const { doneLoading, isAdmin } = this.state;

      if (!doneLoading) return <Loading />;

      return <Component isAdmin={isAdmin} {...this.props as P} />;
    }
  };