import React, { Component } from "react";
import { Button, Card, Subtitle2, Caption, Divider } from 'ui-neumorphism'
import {Col, Row} from "antd";
import "./style.scss";
import {IProps, IState} from "./types";
import Swal from "sweetalert2";

export default class SyncOverview extends Component<IProps, IState> {

  render(): React.ReactNode {
    const { startSync, abortSync, elapsed } = this.props;
    return (
      <div>
        <div>
          <Card
            width={208}
            height={208}
            elevation={3}
            className='clock-wrapper'
            style={{ borderRadius: '208px' }}
          >
            <Card
              flat
              width={208}
              height={208}
              style={{ borderRadius: '208px' }}
              className={`clock-dashed ${elapsed ? 'clock-dashed--animating' : ''}`}
            />
            <span className='elapsed-time'>
              <h3><small>elapsed time</small><br />{ elapsed ? elapsed : "Idle"}</h3>
            </span>
          </Card>
        </div>

        <br />

        <Row gutter={10}>
          <Col xs={12}>
            <Button color='rgb(0, 185, 120)'
                    disabled={elapsed != undefined}
                    block
                    onClick={startSync}>
              synchronize
            </Button>
          </Col>

          <Col xs={12}>
            <Button disabled={elapsed == undefined}
                    color={'rgb(255, 110, 90)'}
                    block
                    onClick={() => {
              Swal.fire({
                title: 'Do you really want to abort the synchronization?',
                text: `It will be unsuccessful!`,
                icon: 'warning',
                focusCancel: true,
                showCancelButton: true,
                confirmButtonText: 'Abort',
                cancelButtonText: 'Cancel',
                customClass: {
                }
              }).then((result) => {
                if (result.value) {
                  abortSync();
                  Swal.fire(
                    'Synchronization aborted!',
                    'The synchronization has stopped and the most recent data will be used instead.',
                    'error',
                  )
                }
              }
            )}}>
              abort
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}