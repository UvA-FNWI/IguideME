import React, { Component } from "react";
import { Divider } from 'ui-neumorphism'
import { Spin, Table } from "antd";
import Admin from "../../index";
import { IProps, IState } from "./types";
import SyncManager from "../../../../components/managers/SyncManager";
import DataMartController from "../../../../api/controllers/datamart";
import { Synchronization } from "../../../../models/app/SyncProvider";
import moment from "moment";
import "./style.scss";

export default class DataMart extends Component<IProps, IState> {

    state = {
        loaded: false,
        synchronizations: []
    }

    componentDidMount(): void {
        DataMartController.getSynchronizations().then((synchronizations: Synchronization[]) =>
            this.setState({
                // sort synchronizations by their start datetime
                synchronizations: synchronizations.sort((a, b) =>
                    moment(a.start, 'MMMM Do[,] YYYY [at] LT').isBefore(
                        moment(b.start, 'MMMM Do[,] YYYY [at] LT')
                    ) ? 1 : -1),
                loaded: true
            })
        );
    }

    render(): React.ReactNode {
        const { loaded, synchronizations }: IState = this.state;
        const backendFormat = 'DD/MM/YYYY HH:mm:ss'
        const timeFormat = 'MMMM Do[,] YYYY [at] LT';
        const successfulSyncs = loaded ? synchronizations.filter(a => a.status === "COMPLETE") : [];
        const latestSuccessful = successfulSyncs.length > 0 ? successfulSyncs[0] : null;

        return (
            <Admin menuKey={"datamart"}>
                <div id={"datamart"}>
                    <h1>Datamart</h1>
                    {loaded ?
                        (latestSuccessful ?
                            <p>
                                The latest successful synchronization took place on
                <b> {moment.utc(latestSuccessful.start, backendFormat).local().format(timeFormat)} </b>
                                <small>({moment.utc(latestSuccessful.start, backendFormat).fromNow()})</small>.
                Synchronizations run automatically at 03:00AM (local university time).
              </p> :
                            <p>No historic synchronizations available.</p>) :
                        <div><Spin /> Retrieving latest synchronization...</div>
                    }

                    <Divider dense style={{ margin: '10px 0' }} />

                    <SyncManager />

                    {loaded &&
                        <React.Fragment>
                            <h1 style={{ marginTop: 20 }}>Historic versions</h1>
                            <Divider dense style={{ margin: '10px 0' }} />

                            <Table scroll={{ x: 240 }} dataSource={synchronizations} columns={[
                                {
                                    title: 'Start timestamp',
                                    dataIndex: 'start_timestamp',
                                    key: 'start_timestamp',
                                },
                                {
                                    title: 'End timestamp',
                                    dataIndex: 'end_timestamp',
                                    key: 'end_timestamp',
                                },
                                {
                                    title: 'Duration',
                                    dataIndex: 'duration',
                                    key: 'duration',
                                },
                                {
                                    title: 'Hash',
                                    dataIndex: 'hash',
                                    key: 'hash',
                                    render: (val, row) => <code>{val}</code>
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                },
                            ]} />
                        </React.Fragment>
                    }
                </div>
            </Admin>
        )
    }
}
