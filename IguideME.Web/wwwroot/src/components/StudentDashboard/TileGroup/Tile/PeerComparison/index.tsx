import React, { Component } from "react";
import "./style.scss";
import {PeerGrades} from "../../../types";

export default class PeerComparison extends Component<{peerGrades: PeerGrades | undefined}> {
  render(): React.ReactNode {
    const { peerGrades } = this.props;

    const round = (val: number) => {
      return Math.round(val * 100) / 100;
    }

    return (
      <div className={"peerComparison"}>
        <span className={"title"}>Peer Comparison</span>

        { peerGrades ?
          <div className={"distribution"}>
            <div className={"min"}>
              <small>min.</small>
              <br />
              { round(peerGrades.min) }
            </div>

            <div className={"avg"}>
              <small>avg.</small>
              <br />
              { round(peerGrades.avg) }
            </div>

            <div className={"max"}>
              <small>max.</small>
              <br />
              { round(peerGrades.max) }
            </div>
          </div> :
          <p>Not available</p>
        }
      </div>
    )
  }
}