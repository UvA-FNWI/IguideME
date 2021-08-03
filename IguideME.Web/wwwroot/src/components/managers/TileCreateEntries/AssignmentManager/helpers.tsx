import React from "react";
import {CloseCircleOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {Button} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {TileEntry} from "../../../../models/app/Tile";
import {CanvasAssignment} from "../../../../models/canvas/Assignment";

export const getColumns = (
  removeAssignment: (entry: TileEntry) => any,
  canvasAssignments: CanvasAssignment[]) => {
  return [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: 'On Canvas',
      dataIndex: 'onCanvas',
      key: 'onCanvas',
      render: (text: string, obj: TileEntry) => {
        const assignment = canvasAssignments.find(c => c.name === obj.title);
        return assignment !== undefined ?
          <span className={"binary success"}><CheckCircleOutlined /> Yes</span> :
          <span className={"binary fail"}><CloseCircleOutlined /> <b>No</b></span>
      }
    }, {
      title: 'Published',
      dataIndex: 'published',
      key: 'published',
      render: (text: string, obj: TileEntry) => {
        const assignment = canvasAssignments.find(c => c.name === obj.title);
        return (assignment && assignment.published) ?
          <div className={"binary success"}><CheckCircleOutlined /> <span>Yes</span></div> :
          <div className={"binary fail"}><CloseCircleOutlined /> <span>No</span></div>
      }
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, obj: TileEntry) => {
        return (
          <Button danger
                  icon={<DeleteOutlined />}
                  shape={"round"}
                  type={"primary"}
                  size={"large"}
                  onClick={() => removeAssignment(obj)}
          />
        )
      }
    }
  ]
}