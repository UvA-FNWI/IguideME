import React, { Component } from "react";
import { Divider, Button } from 'ui-neumorphism'
import {Spin, Table} from "antd";
import Admin from "../../index";
import "./style.scss";
import {IProps, IState} from "./types";
import SyncManager from "../../../../components/managers/SyncManager";
import {MOCK_DATAMART_SYNCHRONIZATIONS} from "../../../../mocks/app/datamart";
import DataMartController from "../../../../api/controllers/datamart";
import {Synchronization} from "../../../../models/app/SyncProvider";
import moment from "moment";

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
    const timeFormat = 'MMMM Do[,] YYYY [at] LT';
    const successfulSyncs = loaded ? synchronizations.filter(a => a.status === "Success") : [];
    const latestSuccessful = successfulSyncs.length > 0 ? successfulSyncs[0] : null;

    return (
      <Admin menuKey={"datamart"}>
        <div id={"datamart"}>
          <h1>Datamart</h1>
          { loaded ?
            (latestSuccessful ?
              <p>
                The latest successful synchronization took place on
                <b> {moment.utc(latestSuccessful.start, timeFormat).local().format(timeFormat)} </b>
                <small>({moment.utc(latestSuccessful.start, timeFormat).fromNow()})</small>.
                Synchronizations run automatically at 03:00AM (local university time).
              </p> :
              <p>No historic synchronizations available.</p>) :
            <p><Spin /> Retrieving latest synchronization...</p>
          }

          <Divider dense style={{margin: '10px 0'}} />

          <SyncManager />

          { loaded &&
            <React.Fragment>
              <h1 style={{marginTop: 20}}>Historic versions</h1>
              <Divider dense style={{margin: '10px 0'}} />

              <Table scroll={{x: 240}} dataSource={MOCK_DATAMART_SYNCHRONIZATIONS} columns={[
                {
                  title: 'Start timestamp',
                  dataIndex: 'start',
                  key: 'start',
                },
                {
                  title: 'End timestamp',
                  dataIndex: 'end',
                  key: 'end',
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
                  title: 'Invoked by',
                  dataIndex: 'invoked',
                  key: 'invoked',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                },
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  render: (val, row) => <Button>Restore</Button>
                },
              ]} />
            </React.Fragment>
          }
        </div>
      </Admin>
    )
  }
}