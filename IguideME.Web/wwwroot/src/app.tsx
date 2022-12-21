import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "./components/utils/Loading";
import DesiredGrade from "./common/DesiredGrade";
import { RootState } from "./store";
import { TileActions } from "./store/actions/tiles";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { UserActions } from "./store/actions/user";
import { CourseActions } from "./store/actions/course";
import { DataMartActions } from "./store/actions/datamart";
import { AppActions } from "./store/actions/app";

const App = React.lazy(() => import('./common/App'));
const Consent = React.lazy(() => import('./common/Consent'));
const AdminDataMart = React.lazy(() => import('./common/Admin/sections/DataMart'));
const AdminTiles = React.lazy(() => import('./common/Admin/sections/Tiles'));
const AdminDashboard = React.lazy(() => import('./common/Admin/sections/Dashboard'));
const AdminAnalytics = React.lazy(() => import('./common/Admin/sections/Analytics'));
const AdminStudentOverview = React.lazy(() => import('./common/Admin/sections/StudentOverview'));
const AdminNotificationCentre = React.lazy(() => import('./common/Admin/sections/NotificationCentre'));
const AdminDataWizard = React.lazy(() => import('./common/Admin/sections/DataWizard'));
const AdminGradeAnalyzer = React.lazy(() => import('./common/Admin/sections/grades/GradeAnalyzer'));
const AdminGradePredictor = React.lazy(() => import('./common/Admin/sections/grades/GradePredictor'));
const AdminGradePredictorOld = React.lazy(() => import('./common/Admin/sections/grades/GradePredictorOld'));
const AdminSettings = React.lazy(() => import('./common/Admin/sections/Settings'));

const mapStateToProps = (state: RootState) => ({
    dashboardColumns: state.dashboardColumns,
    tiles: state.tiles,
    tileEntries: state.tileEntries,
    tileGroups: state.tileGroups,
    course: state.course,
    user: state.user,
    predictions: state.predictions
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>): any => {
    return {
        loadColumns: async () => dispatch(await AppActions.loadColumns()),
        loadTiles: async () => dispatch(await TileActions.loadTiles()),
        loadTileEntries: async () => dispatch(await TileActions.loadTileEntries()),
        loadTileGroups: async () => dispatch(await TileActions.loadGroups()),
        loadCourse: async () => dispatch(await CourseActions.loadCourse()),
        getUser: async () => dispatch(await UserActions.getUser()),
        loadPredictions: async () => dispatch(await DataMartActions.loadPredictions()),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

class IGuideME extends React.Component<Props> {

    componentDidMount(): void {
        const { tiles, tileEntries, tileGroups, user, course, predictions, dashboardColumns } = this.props as any;
        let props = this.props as any;
        if (tiles.length === 0) props.loadTiles();
        if (tileGroups.length === 0) props.loadTileGroups();
        if (tileEntries.length === 0) props.loadTileEntries();
        if (dashboardColumns.length === 0) props.loadColumns();
        if (predictions.length === 0) props.loadPredictions();
        if (!user) props.getUser();
        if (!course) props.loadCourse();
    }

    render(): React.ReactNode {
        const { user, course } = this.props as any;
        if (!user || !course) return <Loading />;

        return (
            <div>
                <Suspense fallback={<Loading />}>
                    <Router>
                        { /* debug() && <DebugMenu /> */}
                        <Switch>
                            <Route path="/admin/analytics" component={AdminAnalytics} />
                            <Route path="/admin/dashboard" component={AdminDashboard} />
                            <Route path="/admin/notification-centre" component={AdminNotificationCentre} />
                            <Route path="/admin/student-overview" component={AdminStudentOverview} />
                            <Route path="/admin/data-wizard" component={AdminDataWizard} />
                            <Route path="/admin/grade-analyzer" component={AdminGradeAnalyzer} />
                            <Route path="/admin/grade-predictor-old" component={AdminGradePredictorOld} />
                            <Route path="/admin/grade-predictor" component={AdminGradePredictor} />
                            <Route path="/admin/settings" component={AdminSettings} />
                            <Route path="/admin/tiles" component={AdminTiles} />
                            <Route path="/admin" component={AdminDataMart} />
                            <Route path="/goal-grade" component={DesiredGrade} />
                            <Route path="/consent" component={Consent} />
                            <Route path="/" component={App} />
                        </Switch>
                    </Router>
                </Suspense>
            </div>
        );
    }
}

export default connector(IGuideME);
