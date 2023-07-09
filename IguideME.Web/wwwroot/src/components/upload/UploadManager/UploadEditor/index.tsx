import React, { Component } from "react";
import {IProps, IState} from "./types";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"

import UploadEditorRow from "./UploadEditorRow"
import { Button, Col, Row } from "antd";

export default class UploadEditor extends Component<IProps, IState> {
  state = {
  }

  changeData = (value:string, row_index: number, col_index: number) => {
    let data = this.props.data;
    data[row_index][col_index] = value;

    this.props.setData(data);
  }

  addColumn = () => {
    let data = this.props.data;

    for (let i = 0; i < data.length; i++) {
      data[i].push("")
    }
    this.props.setData(data);
  }

  removeColumn = (column: number) => {
    let data = this.props.data;

    for (let i = 0; i < data.length; i++) {
      data[i].splice(column, 1);
    }
    this.props.setData(data);
  }

  render(): React.ReactNode {
    const { data, columns, collapsed } = this.props;

    return (
      <div>
      <Row>
        <Col>
        {
          collapsed ?
          <div key={0}>
              <UploadEditorRow row_data={data[0]} row_index={0} changeData={this.changeData} columns={columns}/>
            </div>
          :
          data.map((row, i) => (
            <div key={i}>
              <UploadEditorRow row_data={row} row_index={i} changeData={this.changeData} columns={columns}/>
            </div>
          ))
        }

        </Col>
        <Col>
          <Button type={"ghost"}
                  style={{height: "100%"}}
                  icon= {<PlusOutlined />}
                  onClick={this.addColumn}>
          </Button>
        </Col>
      </Row>
      <Row>
      {
          collapsed ?
          <div>...</div>
          :

            data[0].map((_, i) => (
              <Col key={i}>
                <Button type={"ghost"}
                        style={{width: "120px"}}
                        icon={(<MinusOutlined />)}
                        onClick={() => this.removeColumn(i)}>
                </Button>
              </Col>
              ))

        }
        </Row>
      </div>
    )
  }
}
