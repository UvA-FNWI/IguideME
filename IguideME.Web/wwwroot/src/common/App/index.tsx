import React, { Component } from "react";
import { withConsent } from "../../hoc/withConsent";
import { withAdminRole } from "../../hoc/withAdminRole";
import {UserDataProps} from "../../hoc/types";
import AdminHeader from "../../containers/AdminHeader";
import StudentDashboard from "../../components/StudentDashboard";
import AdminDashboard from "../../components/AdminDashboard";
import {CanvasStudent} from "../../models/canvas/Student";
import UserController from "../../api/controllers/app";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";

const mapState = (state: RootState) => ({
  user: state.user,
  predictions: state.predictions
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & UserDataProps;

class App extends Component<Props, { student: CanvasStudent | null }> {

  state = { student: null }

  componentDidMount(): void {
    const { isAdmin } = this.props;
    if (!isAdmin) {
      UserController.getUser().then(student => this.setState({ student }));
    }
  }

  render(): React.ReactNode {
    const { isAdmin } = this.props;
    const { student } = this.state;

    return (
      <div id={"app"}>
        { isAdmin && <AdminHeader studentPickView={true}
                                  setStudent={student => {
                                    this.setState({ student }, () =>
                                      window.dispatchEvent(
                                        new CustomEvent('selectTile', {
                                          detail: undefined
                                        })
                                      )
                                    )
                                  }}
        /> }
        { isAdmin ?
          <AdminDashboard student={student} /> :
          <StudentDashboard student={student || undefined} />
        }
      </div>
    )
  }
}

export default withConsent(withAdminRole(connector(App)));