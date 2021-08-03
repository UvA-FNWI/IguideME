import React, { Component } from "react";
import {Col, Row} from "antd";
import Select from "react-select";
import { getGradeEntryOptions } from "../helpers";
import { IProps } from "./types";

export default class EntrySelect extends Component<IProps> {

  render(): React.ReactNode {
    const { tiles, entries } = this.props;
    return (
      <Row style={{width: '100%'}}>
        <Col span={10}>
          <Select isLoading={true}
                  options={getGradeEntryOptions(tiles, entries)}
                  onChange={(e: any) => this.props.setEntryOne(e ? e.value : undefined)}
          />
        </Col>
        <Col span={4} style={{textAlign: 'center'}}>
          vs
        </Col>
        <Col span={10}>
          <Select options={getGradeEntryOptions(tiles, entries)}
                  onChange={(e: any) => this.props.setEntryTwo(e ? e.value : undefined)}
          />
        </Col>
      </Row>

    )
  }
}