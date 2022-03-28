import React, { Component } from "react";
import { TileEntry, TileEntrySubmission } from "../../../../../models/app/Tile";
import { Divider, Statistic, Table } from "antd";
import GradeStatistic from "../../../../../containers/GradeStatistic";

export default class EntryItem extends Component<{
    submission: TileEntrySubmission,
    tileEntry: TileEntry
}> {
    render(): React.ReactNode {
        const { tileEntry, submission } = this.props;

        // FIXME the check for type is done because when the mocks were made, no consideration was given to the type of meta. To remove this check, convert the meta objects in the mocks to JSON strings.
        const meta = typeof submission.meta === "string" ? JSON.parse(submission.meta || "{}") : submission.meta || {};

        return (
            <div className={"tileEntry"}>
                <h2>{tileEntry.title}</h2>
                <Divider style={{ margin: '5px 0' }} />

                <GradeStatistic grade={submission.grade} />

                {/* TODO why and when is this visible to the user */}
                { (/* hide meta */ false) && Object.keys(meta).length > 0 &&
                    <div>
                        <Table dataSource={Object.keys(meta).map((key, i) => ({
                            key: i,
                            label: key,
                            value: meta[key]
                        }))} columns={[
                            {
                                title: 'Key',
                                dataIndex: 'label',
                                key: 'label',
                                width: '40%',
                                ellipsis: true
                            },
                            {
                                title: 'Value',
                                dataIndex: 'value',
                                key: 'value',
                            }]} />
                    </div>
                }
            </div>
        )
    }
}
