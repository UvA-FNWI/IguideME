import React, { PureComponent } from "react";
import { Divider, Progress } from "antd";
import GradeDistribution from "./GradeDistribution";
import FadeIn from 'react-fade-in';
import "./tile.scss";
import {isGradeSufficient} from "../../utils/helpers";
import {ITile} from "../../models/ITile";
import StatusIndication from "./StatusIndication";
import {store} from "../../utils/configureStore";
import {setView} from "../../store/actions/view";

type IProps = {
  tile: ITile,
  width: number,
}

export default class Tile extends PureComponent<IProps> {

  progress = () => {
    const { tile: { progress } } = this.props;

    switch(progress) {
      case 0:
        return (<Progress percent={0} status="exception" />);
      case 100:
        return (<Progress percent={100} />);
      case null:
        return null;
      default:
        return (<Progress percent={progress} />);
    }
  }

  render() {
    const { width, tile: { average_grade, name, peer_comparison, progress, visible } } = this.props;

    if (!visible) return null;

    return (
      <div
        style={{ width: `${width}px` }}
        className={"tile"}
        onClick={async () => {
          store.dispatch(await setView(this.props.tile));
        }}
      >
        <FadeIn>
          <div className={`inner ${isGradeSufficient(average_grade || 0) ? 'sufficient' : 'insufficient'}`}>
            <div className={"title"}>
              <h2>{ name }</h2>
            </div>

            { progress !== null ?
              <div>
                {this.progress()}
							</div> : null
            }

            <StatusIndication
              statusFromAverage={!isNaN(average_grade as number)}
              average={average_grade !== null ? average_grade : null}
              progress={progress || null}
              peerAverage={peer_comparison.average}
            />

            <div className={"peer"}>
              <Divider plain>Peer comparison</Divider>
              <GradeDistribution
                min={peer_comparison.minimum}
                max={peer_comparison.maximum}
                avg={peer_comparison.average}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }
}