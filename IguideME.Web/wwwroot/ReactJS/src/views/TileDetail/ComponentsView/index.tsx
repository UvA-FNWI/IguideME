import React, { PureComponent } from "react";
import {IEntry} from "../../../models/ITile";
import { Row, Col, Button } from "antd";
import StatusIndication from "../../../components/Tile/StatusIndication";
import "./components-view.scss";
import { LikeTwoTone, WarningTwoTone } from "@ant-design/icons";

export default class ComponentsView extends PureComponent<{ entries: IEntry[] }> {

  isCompleted = (entry: IEntry): boolean => {
    return (entry.items || []).filter(e => e.status === "unstarted").length === 0;
  }

  renderProgress = (entry: IEntry) => {

    const completed = this.isCompleted(entry);
    const progress = completed ? "completed" : "in-progress";
    const grade = (entry.grade || 10) < 5.5 ? "failed" : "passed";

    if (!completed) return (<span>{progress}</span>);

    return <span>{progress}, {grade}</span>
  }

  renderIemStatus = (status: "failed" | "passed" | "unstarted") => {
    switch(status) {
      case "failed":
        return (
          <WarningTwoTone twoToneColor={"rgb(255, 78, 78)"}/>
        );
      case "passed":
        return (
          <LikeTwoTone twoToneColor={"#52c41a"}/>
        );
      default: return null;
    }
  }

  renderActionButton = (entry: IEntry) => {
    if (entry.hide_action_button) return null;

    return (
      <Button block type={this.isCompleted(entry) ? "dashed" : "default"}>
        { this.isCompleted(entry) ? "Retake" : "Take" }
      </Button>
    )
  }

  renderMetaData = (metadata: any) => {
    if (typeof metadata === 'string' || metadata instanceof String) {
      // html has already been validated by Canvas, so there shouldn't be
      // anything dangerous
      return <div dangerouslySetInnerHTML={{__html: String(metadata)}} />
    }

    return Object.keys(metadata).map(key => {
      return (
        <p><b>{key}:</b> {metadata[key]}</p>
      );
    });
  }

  render(): React.ReactNode {
    const { entries } = this.props;
    return (
      <div id={"componentsView"}>
        <Row>
          { entries.map(entry => {
            return (
              <Col
                xs={24}
                sm={entry.extra_wide ? 24 : 12}
                md={entry.extra_wide ? 12 : 8}
                lg={entry.extra_wide ? 8 : 6}
              >
                <div className={"component"}>
                  <div className={"progress"}>
                    { this.renderProgress(entry) }
                  </div>

                  <h2>{ entry.name }</h2>
                  { entry.grade !== null &&
                    (this.isCompleted(entry) ?
                      <StatusIndication statusFromAverage={true} average={entry.grade} /> :
                      <span>-</span>)
                  }

                  { (entry.items || []).map(item => {
                    return (
                      <div className={"items"}>
                        <Row>
                          <Col xs={19} md={12}>
                            <a href={item.referer}>{ item.name }</a>
                          </Col>

                          <Col xs={5} md={12}>
                            { this.renderIemStatus(item.status) }
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                  { entry.metadata && this.renderMetaData(entry.metadata) }
                  { this.renderActionButton(entry) }
                </div>
              </Col>
            )
          }) }
        </Row>
      </div>
    )
  }
}