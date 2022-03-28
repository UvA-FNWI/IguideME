import { Col, Divider, Row } from "antd";
import React, { Component } from "react";
import { Tile } from "../../../../models/app/Tile";
import { CanvasDiscussion } from "../../../../models/canvas/Discussion";
import "./style.scss";

export default class DiscussionsList extends Component<{
    discussions: CanvasDiscussion[],
    tile: Tile
}> {
    render(): React.ReactNode {
        const { discussions } = this.props;
        return (
            <div id={"discussionsList"}>
                <Row gutter={[10, 10]}>
                    {discussions.map(d => {
                        return (
                            <Col key={d.id} xs={24} md={12} lg={8}>
                                <div className={"discussion"}>
                                    <h2>{d.title}</h2>
                                    <small>{d.posted_at}</small>
                                    <Divider />
                                    <p dangerouslySetInnerHTML={{ __html: d.message }} />
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        )
    }
}
