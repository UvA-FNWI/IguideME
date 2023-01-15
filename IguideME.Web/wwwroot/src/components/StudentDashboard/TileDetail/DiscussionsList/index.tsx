import { Col, Divider, Row } from "antd";
import React, { Component } from "react";
import { Tile } from "../../../../models/app/Tile";
import { CanvasDiscussion, discussionType } from "../../../../models/canvas/Discussion";
import { CanvasStudent } from "../../../../models/canvas/Student";
import "./style.scss";

interface data {
    type: discussionType;
    array: JSX.Element[];
    title: string;
}

export default class DiscussionsList extends Component<{
    discussions: CanvasDiscussion[],
    tile: Tile,
    student: CanvasStudent
}> {

    handle_entry_or_reply(discussion: CanvasDiscussion, student: CanvasStudent): JSX.Element {
        return (
            <>
            <Divider />
            <p dangerouslySetInnerHTML={{ __html: discussion.message }} />
            <small>{discussion.posted_at}</small>
            </>
        );
    }

    handle_topic(discussion: CanvasDiscussion, student: CanvasStudent): JSX.Element | null {
        if (discussion.posted_by === student.name) {
            return (
                <Col key={discussion.id} xs={24} md={12} lg={8}>
                    <div className={"discussion"}>
                        <h2>{discussion.title}</h2>
                        <small>{discussion.posted_at}</small>
                        <Divider />
                        <p dangerouslySetInnerHTML={{ __html: discussion.message }} />
                    </div>
                </Col>
            )
        } else {return null}
    }

    render(): React.ReactNode {
        const { discussions, student } = this.props;

        let html = new Map<string, data>();
        let html_list: JSX.Element[] = [];
        let elem: JSX.Element | null;
        let data: data | undefined;
        let discussion: CanvasDiscussion;

        for (let i = 0; i < discussions.length; i++) {
            discussion = discussions[i];

            switch (discussion.type) {
                case (discussionType.topic):
                    elem = this.handle_topic(discussion, student);
                    if (!elem) break;

                    data = html.get(discussion.discussion_id.toString());
                    if (data === undefined){
                        html.set(discussion.discussion_id.toString(), {type: discussion.type, array:[elem], title: ""});
                    } else {
                        data.array.push(elem);
                    }
                    break;
                case (discussionType.entry):
                    elem = this.handle_entry_or_reply(discussion, student);
                    data = html.get(`${discussion.parent_id}.entries`);
                    if (data === undefined){
                        html.set(`${discussion.parent_id}.entries`, {type: discussion.type, array:[elem], title: discussion.title});
                    } else {
                        data.array.push(elem);
                    }
                    break;
                case (discussionType.reply):
                    elem = this.handle_entry_or_reply(discussion, student);
                    data = html.get(`${discussion.parent_id}.replies`);
                    if (data === undefined){
                        html.set(`${discussion.parent_id}.replies`, {type: discussion.type, array:[elem], title: discussion.title});
                    } else {
                        data.array.push(elem);
                    }
                    break;
            }
        }

        for (let value of html.values()) {
            switch (value.type) {
                case (discussionType.topic):
                    html_list = html_list.concat(value.array)
                    break
                case (discussionType.entry):
                    html_list.push((
                        <Col key="{value.array[0].parent_id}.entries" xs={24} md={12} lg={8}>
                            <div className={"discussion"}>
                                <h2>Questions in: {value.title}</h2>
                                {value.array}
                            </div>
                        </Col>
                    ))
                    break;
                case (discussionType.reply):
                    html_list.push((
                        <Col key="{value.array[0].parent_id}.replies" xs={24} md={12} lg={8}>
                            <div className={"discussion"}>
                                <h2>Replies in: {value.title}</h2>
                                {value.array}
                            </div>
                        </Col>
                    ))
                    break;
            }
        }
        return (
            <div id={"discussionsList"}>
                <Row gutter={[10, 10]}>
                    {html_list}
                </Row>
            </div>
        )
    }
}
