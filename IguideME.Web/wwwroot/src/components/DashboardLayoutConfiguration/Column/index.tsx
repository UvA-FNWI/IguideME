import React, { Component } from "react";
import {IProps} from "./types";
import {Button, Col, Divider, Row} from "antd";
import Select from "react-select";
import { DeleteOutlined } from "@ant-design/icons";
import "./style.scss";
import {DashboardColumnWidth} from "../../../models/app/Layout";
import {TileGroup} from "../../../models/app/Tile";
import TileController from "../../../api/controllers/tile";
import LayoutController from "../../../api/controllers/layout";

export default class Column extends Component<IProps> {

  changeWidth = (width: string) => {
    let { column, tileGroups } = this.props;

    let ref = JSON.parse(JSON.stringify(column));
    ref.container_width = width as DashboardColumnWidth;
    this.props.update(ref, tileGroups);
  }

  render() {
    const { column, number, tileGroups, allTileGroups } = this.props;

    const selectOptions = [
      { label: "Small", value: "small" },
      { label: "Middle", value: "middle" },
      { label: "Large", value: "large" },
      { label: "Full width", value: "fullwidth" }
    ];

    return (
      <div className={"primaryContainer " + column.container_width}>
        <h2>Column #{number}</h2>

        <label>Column width</label>
        <Row gutter={[10, 10]}>
          <Col flex={"auto"}>
            <Select onChange={(e) => e && this.changeWidth(e.value) }
                    value={selectOptions.find(o => o.value === column.container_width) || null}
                    options={selectOptions}
            />
          </Col>
          <Col flex={'80px'}>
            <Button type="primary"
                    shape="round"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      LayoutController.deleteColumn(column.id).then(_ => this.props.removeColumn(column))
                    }}
                    danger
            />
          </Col>
        </Row>

        <Divider />
        <h3>Tiles</h3>

        { tileGroups
          .sort((a, b) => a.position - b.position)
          .map(group => (
            <div style={{marginBottom: 10}}>
              <span>
                <Button icon={<DeleteOutlined />}
                        onClick={() => {
                          let cache: TileGroup = JSON.parse(JSON.stringify(group));
                          cache.column_id = -1;
                          this.props.updateGroup(cache);
                        }}
                        danger />
                {' '}
                <b>{ group.title }</b>
              </span>
            </div>
          ))
        }

        <Select onChange={(e) => {
                  if (!e) return;

                  let cache: TileGroup = JSON.parse(JSON.stringify(allTileGroups.find(tg => tg.id === e.value)));
                  cache.column_id = column.id;
                  cache.position = tileGroups.length + 1;
                  TileController.updateTileGroup(cache).then(tg => {
                    this.props.updateGroup(tg);
                  });
                }}
                options={allTileGroups.filter(tg => tg.column_id < 1)
                  .map(tg => ({ label: tg.title, value: tg.id }))}
        />
      </div>
    );
  }
}