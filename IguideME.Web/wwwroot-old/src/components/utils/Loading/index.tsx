import React, {PureComponent} from "react";
import { Loading as LoadingDots } from 'react-loading-dot'
import "./style.scss";

export default class Loading extends PureComponent<{ small?: boolean}> {

  render(): React.ReactNode {
    return (
      <div className={`loading ${this.props.small && "small"}`}>
        <div className={"header"}>
          <h1>IguideME</h1>
          <LoadingDots size={'10px'} margin={'10px'} background={'black'} />
        </div>
      </div>
    )
  }
}
