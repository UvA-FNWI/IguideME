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
                    moment(a.start_timestamp, 'MM/DD/YYYY HH:mm:ss').isBefore(
                        moment(b.start_timestamp, 'MM/DD/YYYY HH:mm:ss')
                    ) ? 1 : -1
                    ),
                loaded: true,
            })
        );
    }

    render(): React.ReactNode {
        const { loaded, synchronizations }: IState = this.state;
        const timeFormat = 'MMMM Do[,] YYYY [at] HH:mm';
        const durationFormat = 'm[m] s[s]'

        const successfulSyncs = loaded ? synchronizations.filter(a => a.status === "COMPLETE") : [];
        const latestSuccessful = successfulSyncs.length > 0 ? successfulSyncs[0] : null;

        const syncs = synchronizations.map( (s: Synchronization) => {
            const start = moment(s.start_timestamp);
            if (s.end_timestamp === null) {
                return ({
                    start_timestamp: start.format(timeFormat),
                    end_timestamp: null,
                    duration: null,
                    status: s.status
                })
            }

            const end = moment(s.end_timestamp);
            const duration = moment(end.diff(start)).format(durationFormat);

            return ({
                start_timestamp: start.format(timeFormat),
                end_timestamp: end.format(timeFormat),
                duration: duration,
                status: s.status
            })
        })

        return (
            <Admin menuKey={"datamart"}>
                <div id={"datamart"}>
                    <h1>Datamart</h1>
                    {loaded ?
                        (latestSuccessful ?
                            <p>
                                The latest successful synchronization took place on
                                <b> {moment(latestSuccessful.start_timestamp).format(timeFormat)} </b>
                                    <small>({moment(latestSuccessful.start_timestamp).fromNow()})</small>.
                                Syncs run automatically at 03:00AM (UTC time).
                            </p> :
                            <p>No historic syncs available.</p>) :
                        <div><Spin /> Retrieving latest synchronization...</div>
                    }

                    <Divider dense style={{ margin: '10px 0' }} />

                    <SyncManager prevsuccess={syncs && syncs[0] ? syncs[0].status === "COMPLETE" : false}/>

                    {loaded &&
                        <React.Fragment>
                            <h1 style={{ marginTop: 20 }}>Historic versions</h1>
                            <Divider dense style={{ margin: '10px 0' }} />

                            <Table scroll={{ x: 240 }} dataSource={syncs} columns={[
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
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                    render: (val, row) => <code>{val}</code>
                                },
                            ]} />
                        </React.Fragment>
                    }
                </div>
            </Admin>
        )
    }
}
