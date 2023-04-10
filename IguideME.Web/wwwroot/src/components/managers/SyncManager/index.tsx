import React, { Component } from "react";
import { Badge, Col, message, Row } from "antd";
import SyncOverview from "./SyncOverview";
import { elapsedTime, syncStates } from "./helpers";
import { Alert, Caption, Card } from "ui-neumorphism";
import { IProps, IState } from "./types";
import DataMartController from "../../../api/controllers/datamart";
import moment from "moment";
import { SyncProvider } from "../../../models/app/SyncProvider";
import Loading from "../../utils/Loading";
import { debug } from "../../../config/config";

export default class SyncManager extends Component<IProps, IState> {
    private interval: NodeJS.Timeout | undefined;

    state = {
        loaded: false,
        start: undefined,
        elapsedTime: undefined,
        datamartError: false,
        currentTask: null,
        completedTasks: [],
        currentTasks: []
    }

    componentDidMount(): void {
        this.setState({ loaded: true });
    }

    componentWillUnmount(): void {
        if (debug()) localStorage.removeItem("debugHandshake");
    }

    badgeStyle = (task: string): { color: "success" | "warning" | "error", text: string } => {
        const { currentTask } = this.state;
        const idx = syncStates.findIndex(ss => ss.id === task);
        const currentIdx = syncStates.findIndex(ss => ss.id === currentTask);
        console.log("state:", this.state )
        console.log("task:", task )

        if (this.props.prevsuccess && this.state.start === undefined) {
            return { color: 'success', text: "Completed" }
        }

        if (idx < currentIdx) {
            return { color: 'success', text: "Completed" }
        } else if (idx === currentIdx) {
            return { color: 'warning', text: "In-progress" }
        } else return { color: 'error', text: "Unstarted" }
    }

    startSync = () => {
        // initialize error prompts
        this.setState({ datamartError: false });

        DataMartController.startNewSync().then(success => {
            if (success) {
                message.success("Sync started!");
                this.setState({ start: moment.utc() })
                this.pollSync();
            } else this.setState({ datamartError: true });
        });
    }

    pollSync = () => {
        // start interval updating the admin's UI every second
        this.interval = setInterval(async () => {
            await DataMartController.getStatus().then(data => {
                const keys = Object.keys(data);
                const current = keys.find(k => data[k].progressInformation !== SyncProvider.DONE);

                if (!current) {
                    this.setState({ start: undefined });
                    clearInterval(this.interval!);
                    return;
                }

                this.setState({
                    elapsedTime: elapsedTime(moment.utc(data[current].startTime)),
                    currentTask: data[current].progressInformation
                })
            });
        }, 1000);
    }

    abortSync = () => {
        // TODO: stop sync on server as well x)
        if (this.interval) clearInterval(this.interval);
        this.setState({ start: undefined, completedTasks: [], currentTasks: [] });
    }

    render(): React.ReactNode {
        const { loaded, datamartError } = this.state;

        if (!loaded) return <Loading small={true} />;

        return (
            <Row gutter={[20, 20]}>
                <Col xs={24} md={12} lg={9}>
                    <SyncOverview startSync={this.startSync}
                        abortSync={this.abortSync}
                        elapsed={elapsedTime(this.state.start)} />

                    {datamartError &&
                        <Alert type='error' outlined style={{ marginTop: 20 }}>
                            Failed to reach datamart. Try again later!
                        </Alert>}
                </Col>

                <Col xs={24} md={12} lg={15}>
                    <Card elevation={1} style={{ padding: 10, backgroundColor: 'rgb(246, 248, 250)' }}>
                        <Row gutter={[10, 10]}>
                            {syncStates.map(state => (
                                <Col key={state.id} xs={24} lg={12}>
                                    <Card style={{ display: 'flex', alignItems: 'center' }} elevation={1}>
                                        <Card flat style={{ width: '100%', padding: 20 }}>
                                            <Badge status={this.badgeStyle(state.id).color}
                                                text={this.badgeStyle(state.id).text}
                                                style={{ float: 'right' }} />
                                            <h4 style={{ margin: 0 }}>{state.title}</h4>
                                            <Caption secondary component='span'>
                                                {state.description}
                                            </Caption>
                                        </Card>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}
