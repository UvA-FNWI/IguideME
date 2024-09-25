import React, { Component } from "react";
import { TileEntry, TileEntrySubmission } from "../../../../models/app/Tile";
import { Col, Row } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./style.scss";

export default class BinaryGrades extends Component<{
    submissions: TileEntrySubmission[],
    tileEntries: TileEntry[]
}> {
    render(): React.ReactNode {
        const { submissions, tileEntries } = this.props;

        return (
            <div id={"binaryEntries"}>
                <Row gutter={[5, 5]}>
                    {submissions.map(s => {
                        const success = s.grade.toString().slice(0, 1) !== "0";
                        const entry = tileEntries.find(e => e.id === s.entry_id);

                        return (
                            <Col key={s.entry_id} xs={12} md={8} lg={6}>
                                <div className={`entry ${success ? "success" : "fail"}`}>
                                    <h2>{entry ? entry.title : null}</h2>
                                    {success ?
                                        <span><CheckOutlined /> Present</span> :
                                        <span>Absent</span>}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        )
    }
}
