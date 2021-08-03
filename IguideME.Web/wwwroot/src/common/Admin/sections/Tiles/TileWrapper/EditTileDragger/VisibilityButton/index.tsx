import React, { Component } from "react";
import {IProps} from "./types";
import {Button} from "antd";

export default class VisibilityButton extends Component<IProps> {
  render(): React.ReactNode {
    const { visible, setVisibility } = this.props;

    return (
      <div>
        <Button size={"large"}
                className={visible ? "successButton" : "dangerButton"}
                onClick={() => setVisibility(!visible)}
        >
          { visible ? "Visible" : "Hidden" }
        </Button>
      </div>
    )
  }
}