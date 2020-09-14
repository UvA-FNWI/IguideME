import React, { PureComponent } from "react";
import {isGradeSufficient} from "../../../utils/helpers";
import { LikeTwoTone, WarningTwoTone } from '@ant-design/icons';
import {Statistic, Tooltip} from "antd";

type IProps = {
  statusFromAverage: boolean;
  average?: number | null;
  progress?: number | null;
  peerAverage?: number;
}

const THUMBS_UP_DESCRIPTION = "You're doing great!";
const THUMBS_DOWN_DESCRIPTION = "You're behind the desired average";

export default class StatusIndication extends PureComponent<IProps> {
  /**
   * If `statusFromAverage` is set to true then the `average` property has to be set.
   * The status will be sufficient if the average is above or equal to 5.5. If set to
   * false then the sufficiency will be computed by asserting that the progress of the
   * user is beyond the group average.
   */

  indicateByAverage = (average: number) => {
    return (
      <Statistic
        prefix={
          isGradeSufficient(average) ?
            <Tooltip title={THUMBS_UP_DESCRIPTION}>
              <LikeTwoTone twoToneColor={"#52c41a"}/>
            </Tooltip> :
            <Tooltip title={THUMBS_DOWN_DESCRIPTION}>
              <WarningTwoTone twoToneColor={"rgb(255, 78, 78)"}/>
            </Tooltip>
        }
        value={average}
        suffix="/ 10"
      />
    )
  }

  indicateByPeerComparison = (progress: number, peer_average: number) => {
    if (progress >= peer_average) {
      return (
        <h1>
          <Tooltip title={THUMBS_UP_DESCRIPTION}>
            <LikeTwoTone twoToneColor={"#52c41a"}/>
          </Tooltip>
        </h1>
      );
    }

    return (
      <h1>
        <Tooltip title={THUMBS_DOWN_DESCRIPTION}>
          <WarningTwoTone twoToneColor={"rgb(255, 78, 78)"}/>
        </Tooltip>
      </h1>
    );
  }

  render(): React.ReactNode {
    const { statusFromAverage, average, progress, peerAverage } = this.props;

    return (
      <div>
        <div className={"statistic"}>
          { statusFromAverage ?
            this.indicateByAverage(average!) :
            this.indicateByPeerComparison(progress!, peerAverage!)
          }
        </div>
      </div>
    )
  }
}