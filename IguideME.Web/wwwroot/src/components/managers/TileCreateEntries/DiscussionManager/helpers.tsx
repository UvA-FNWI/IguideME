import {Button} from "antd";
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import {TileEntry} from "../../../../models/app/Tile";
import {CanvasDiscussion} from "../../../../models/canvas/Discussion";

export const getColumns = (
  removeDiscussion: (entry: TileEntry) => any,
  canvasDiscussions: CanvasDiscussion[]
) => {
  return [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: 'On Canvas',
      dataIndex: 'onCanvas',
      key: 'onCanvas',
      render: (text: string, obj: TileEntry) => {
        const discussion = canvasDiscussions.find(d => d.title === obj.title);
        return discussion !== undefined ?
          <span className={"binary success"}><CheckCircleOutlined /> Yes</span> :
          <span className={"binary fail"}><CloseCircleOutlined /> <b>No</b></span>
      }
    }, {
      title: 'Posted by',
      dataIndex: 'posted_by',
      key: 'posted_by',
      render: (text: string, obj: TileEntry) => {
        const discussion = canvasDiscussions.find(d => d.title === obj.title);
        return discussion ? discussion.posted_by : "n/a"
      }
    }, {
      title: 'Posted at',
      dataIndex: 'posted_at',
      key: 'posted_at',
      render: (text: string, obj: TileEntry) => {
        const discussion = canvasDiscussions.find(d => d.title === obj.title);
        return discussion ? discussion.posted_at : "n/a"
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
            onClick={() => removeDiscussion(obj)}
          />
      )
      }
    }
  ]
}