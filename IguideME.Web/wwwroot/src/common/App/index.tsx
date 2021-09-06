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
import Loading from "../../components/utils/Loading";
import { Redirect } from "react-router-dom";

const mapState = (state: RootState) => ({
  user: state.user,
  predictions: state.predictions
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & UserDataProps;

class App extends Component<Props, { student: CanvasStudent | null, goalGrade: number | undefined }> {

  state = { student: null, goalGrade: undefined }

  componentDidMount(): void {
    const { isAdmin } = this.props;
    if (!isAdmin) {
      UserController.getUser().then(student => this.setState({ student }));
      UserController.getGoalGrade().then(goalGrade => this.setState({ goalGrade }));
    } else {
      this.setState({ goalGrade: 10 });
    }
  }

  render(): React.ReactNode {
    const { isAdmin } = this.props;
    const { student, goalGrade } = this.state;

    if (goalGrade === undefined) return <Loading />;
    if (goalGrade === -1) return <Redirect to={'goal-grade'} />;

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
          student === null ?
            <h1>Your account has not yet been processed, try again tomorrow!</h1>:
            <StudentDashboard student={student || undefined} />
        }
      </div>
    )
  }
}

export default withConsent(withAdminRole(connector(App)));