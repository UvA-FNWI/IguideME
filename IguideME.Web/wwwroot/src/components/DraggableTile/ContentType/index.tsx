import React, { Component } from "react";
import {TileContentTypes} from "../../../models/app/Tile";
import { FieldBinaryOutlined, AppstoreOutlined, StockOutlined, TrophyOutlined } from "@ant-design/icons";
import {Space} from "antd";

export default class ContentType extends Component<{ content: TileContentTypes}> {

  getName = () => {
    switch (this.props.content) {
      case "BINARY":
        return "Binary";
      case "ENTRIES":
        return "Entries";
      case "LEARNING_OUTCOMES":
        return "Learning Outcomes";
      case "PREDICTION":
        return "Prediction";
    }
  }

  getIcon = () => {
    switch(this.props.content) {
      case "BINARY":
        return <FieldBinaryOutlined />;
      case "ENTRIES":
        return <AppstoreOutlined />;
      case "PREDICTION":
        return <StockOutlined />;
      case "LEARNING_OUTCOMES":
        return <TrophyOutlined />;
    }
  }

  render(): React.ReactNode {
    return (
      <div id={"contentType"}>
        <Space direction={"horizontal"} style={{ width: '100%'}}>
          { this.getIcon() }
          <span><b>{ this.getName() }</b></span>
        </Space>
      </div>
    )
  }
}