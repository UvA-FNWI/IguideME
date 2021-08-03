import React, { Component } from "react";
import {TileTypeTypes} from "../../../models/app/Tile";

export default class TileType extends Component<{ type: TileTypeTypes }> {

  getName = () => {
    switch (this.props.type) {
      case "ASSIGNMENTS":
        return "Assignments";
      case "DISCUSSIONS":
        return "Discussions";
      case "EXTERNAL_DATA":
        return "External Data";
    }
  }

  render(): React.ReactNode {
    return (
      <div id={"tileType"}>
        <span><b>{ this.getName() }</b></span>
      </div>
    )
  }
}