import { Col, Divider, Row } from "antd";
import React, { Component } from "react";
import { Tile } from "../../../../models/app/Tile";
import { CanvasDiscussion } from "../../../../models/canvas/Discussion";
import { CanvasDiscussionEntry } from "../../../../models/canvas/DiscussionEntry";
import { CanvasStudent } from "../../../../models/canvas/Student";
import "./style.scss";

export default class DiscussionsList extends Component<{
    discussions: CanvasDiscussion[],
    tile: Tile,
    student: CanvasStudent
}> {
    render(): React.ReactNode {
        const { discussions, student } = this.props;
        let html = []
        let discussion: CanvasDiscussion;
        let entry: CanvasDiscussionEntry;
        for (let i = 0; i < discussions.length; i++) {
            discussion = discussions[i];

            if (discussion.posted_by === student.name) {
                html.push((
                        <Col key={discussion.id} xs={24} md={12} lg={8}>
                            <div className={"discussion"}>
                                <h2>{discussion.title}</h2>
                                <small>{discussion.posted_at}</small>
                                <Divider />
                                <p dangerouslySetInnerHTML={{ __html: discussion.message }} />
                            </div>
                        </Col>
                ));
            }
            if (discussion.entries === undefined || discussion.entries.length === 0) {
                continue;
            }

            let html_entries = [];
            for (let j = 0; j < discussion.entries.length; j++) {
                entry = discussion.entries[j];
                console.log("entry", entry)
                html_entries.push((
                        <>
                        <Divider />
                        <p dangerouslySetInnerHTML={{ __html: entry.message }} />
                        <small>{entry.posted_at}</small>
                        </>
                ));
            }
            html.push((
                <Col key="{discussion.id}.entries" xs={24} md={12} lg={8}>
                <div className={"discussion"}>
                    <h2>Questions in: {discussion.title}</h2>
                    {html_entries}
                </div>
            </Col>
            ))
        }

        return (
            <div id={"discussionsList"}>
                <Row gutter={[10, 10]}>
                    {html}
                </Row>
            </div>
        )
    }
}
