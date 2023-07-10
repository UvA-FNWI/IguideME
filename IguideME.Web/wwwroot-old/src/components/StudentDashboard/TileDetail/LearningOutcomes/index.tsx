import React, { Component } from "react";
import { TileEntry} from "../../../../models/app/Tile";
import { Badge, Card} from "antd";
import "./style.scss";
import { LearningOutcome } from "../../../../models/app/LearningGoal";

export default class LearningOutcomes extends Component<{
    learningOutcomes: LearningOutcome[],
    tileEntries: TileEntry[]
}> {
    render(): React.ReactNode {
        const { learningOutcomes, tileEntries } = this.props;

        const formatExpression = (exp: string | null) => {
            switch (exp) {
                case "lte": return "≤";
                case "gte": return "≥";
                default: return "=";
            }
        }

        return (
            <div id={"learningOutcomes"}>
                <div style={{ margin: "0 auto", maxWidth: '400px', width: '100%' }}>
                    {learningOutcomes.map((lo, i) => {
                        return (
                            <div key={lo.goal.id} style={{ margin: "5px 0" }}>
                                <Badge.Ribbon text={lo.success ? "Completed" : "Not completed"} color={lo.success ? "green" : "red"}>
                                    <Card title={`Goal ${i}`} size="small">
                                        <strong>
                                            {lo.goal.title}
                                        </strong>
                                        <br />
                                        {lo.goal.requirements.map(r => {
                                            const entry = tileEntries.find(e => e.id === r.entry_id);

                                            return (
                                                <span>{entry ? entry.title : "???"} {formatExpression(r.expression)} { r.value}<br /></span>
                                            )
                                        })}
                                    </Card>
                                </Badge.Ribbon>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}
