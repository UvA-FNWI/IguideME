import React, { Component } from "react";
import {IProps, IState} from "./types";
import { Col, Input, Row } from "antd";
import "./style.scss";

export default class UploadEditor extends Component<IProps, IState> {
  state = {
  }

  componentDidMount(): void {
  }

  changeData = (event: React.ChangeEvent<HTMLInputElement>, col_index: number) => {
    const value = event.target.value;
    const {row_index, changeData} = this.props;
    changeData(value, row_index, col_index);
  }

  getClass = (id: number) => {
    const { columns } = this.props;
    switch (id) {
      case columns.id:
        return "id_column";
      case columns.grade:
        return "grade_column";
      default:
        return "meta_column";
    }
  }

  render(): React.ReactNode {

    const { row_data } = this.props;

    return (
      <Row >
        {
          row_data.map((col: any, col_index: number) => (
            <Col key={col_index} >
              <Input style={{ width: "120px"}} className={this.getClass(col_index)} value={col} onChange={(e) => this.changeData(e, col_index)} />
            </Col>
          ))
        }
      </Row>
    )
  }
}
