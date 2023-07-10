import React, { Component } from "react";
import {Col, Row} from "antd";
import FadeIn from "react-fade-in";
import {TileContentTypes} from "../../../../models/app/Tile";

export default class CreationPreview extends Component<{ contentType: TileContentTypes }> {

  getTitle = () => {
    switch (this.props.contentType) {
      case "BINARY":
        return "Binary tiles";
      case "ENTRIES":
        return "Entries";
      default:
          return "";
    }
  }

  getDescription = () => {
    switch (this.props.contentType) {
      case "BINARY":
        return "Binary tiles project data whose unit can take on only two possible states, given by a grade of 0 and 1.";
      case "ENTRIES":
        return "The entries content type is most suitable for tiles containing gradable components";
      default:
        return "";
    }
  }

  render(): React.ReactNode {
    const { contentType } = this.props;

    console.log("RENDER", contentType);
    if (!contentType) {
      return <span>error?</span>;
    }

    ////<div id={"mockRender"} className={contentType.toLowerCase()} />

    return (
      <div id={"preview"}>
        <Row gutter={[10, 10]}>
          <Col xs={24} md={8}>
            <FadeIn>
              <div id={"mockRender"} className={contentType ? contentType.toLowerCase() : ""} />
            </FadeIn>
          </Col>
          <Col xs={24} md={16} id={"description"}>
            <div id={"descriptionWrapper"}>
              <h2>{ this.getTitle() }</h2>
              <span>{ this.getDescription() }</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}