import { FC, ReactElement } from "react";

import './style.scss'
import { Badge, Col, Row } from "antd";
import { JobStatus } from "@/types/synchronization";
import { LiteralUnion } from "antd/es/_util/type";

type Props = {
    title: string | undefined;
    description: string | undefined;
    status: JobStatus | undefined;
}

const status_colors = new Map<String, LiteralUnion<'red'|'orange'|'yellow'|'green'>> ([[JobStatus.Errored, 'red'], [JobStatus.Pending, 'orange'], [JobStatus.Processing, 'yellow'], [JobStatus.Success, 'green']])

const StatusCard: FC<Props> = ({title, description, status}): ReactElement => {
    return (
        <div className="card">
            <Row justify='space-between'>
                <Col>
                    <h4 >
                        {title}
                    </h4>
                </Col>
                <Col>
                    <span>
                        <Badge color={status_colors.get(status ?? JobStatus.Success)!} text={status ?? JobStatus.Success}/>
                    </span>
                </Col>
            </Row>
            <Row>
            <span >
                {description}
            </span>
            </Row>
        </div>
    );
}

export default StatusCard;
