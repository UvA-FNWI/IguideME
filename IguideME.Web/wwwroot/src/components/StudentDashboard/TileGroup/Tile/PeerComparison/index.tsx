import React, { Component } from "react";
import "./style.scss";
import { PeerGrades } from "../../../types";

export default class PeerComparison extends Component<{ peerGrades: PeerGrades | undefined }> {
  render(): React.ReactNode {
    const { peerGrades } = this.props;


    return (
      <div className={"peerComparison"}>
        <span className={"title"}>Peer Comparison</span>

        {peerGrades ?
          <div className={"distribution"}>
            <div className={"min"}>
              <small>min.</small>
              <br />
              {peerGrades.min.toFixed(1)}%
            </div>

            <div className={"avg"}>
              <small>avg.</small>
              <br />
              {peerGrades.avg.toFixed(1)}%
            </div>

            <div className={"max"}>
              <small>max.</small>
              <br />
              {peerGrades.max.toFixed(1)}%
            </div>
          </div> :
          <p>Not available</p>
        }
      </div>
    )
  }
}
