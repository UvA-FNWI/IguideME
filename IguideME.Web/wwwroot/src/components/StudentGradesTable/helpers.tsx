import React from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import {Tile, TileEntry, TileEntrySubmission} from "../../models/app/Tile";
import {CanvasStudent} from "../../models/canvas/Student";
import {Col, Progress, Row, Space, Tooltip} from "antd";
import GradeSpread from "../visuals/GradeSpread";
import { ColumnsType } from "antd/lib/table";
import { CanvasDiscussion } from "../../models/canvas/Discussion";


function entriesColumns(tile: Tile, tileEntries: TileEntry[], averaged: boolean) {
  if (averaged) return averagedEntriesColumns(tile, tileEntries);
  return {
    title: tile.title,
    children: tileEntries.map(e => ({
    title: e.title,
    dataIndex: tile.id + "_" + e.id,
    key: e.id,
    width: 150,
    render: (text: string, _: any) => {
      if (!text) return (
        <Tooltip title={"No grade available"}>
          <EllipsisOutlined />
        </Tooltip>
      );

      // TODO: look at total points for colors.
      try {
        const gradeNum = parseFloat(text);
        if (gradeNum < 5.5) return <span className={"dangerText"}><b>{ text }</b></span>;
        if (gradeNum >= 9.5) return <span className={"successText"}><b>{ text }</b></span>;
      } catch { }
      return text;
    }
    }))
  }
}

function averagedEntriesColumns(tile: Tile, tileEntries: TileEntry[]) {
  return {
    title: tile.title,
    dataIndex: tile.id,
    key: 'tile_' + tile.id.toString(),
    width: 250,
    render: (text: string, row: any) => {
      const keys  = tileEntries.map(e => `${e.tile_id}_${e.id}`);
      const grades: number[] = keys.map(key => row[key])
        .filter(x => x.length > 0)
        .map(x => parseFloat(x));

      const average = grades.length > 0 ?
        grades.reduce((a, b) => a + b, 0) / grades.length :
        null;

      return (
        <Row>
          <Col xs={4}>
            { average ?
              <Tooltip title={grades.sort((a, b) => a - b).join(", ")}>
                { Math.round(average * 100) / 100 }
              </Tooltip> :
              "N/A"
            }
          </Col>
          <Col xs={20}>
            <GradeSpread average={average || undefined} grades={grades} />
          </Col>
        </Row>
      );
    }
  }
}

function binaryColumn(tile: Tile, tileEntries: TileEntry[]) {

  const total = tileEntries.length;

  return {
    title: tile.title,
    dataIndex: tile.id,
    key: tile.id,
    width: 150,
    render: (text: string, _: any) => {
      return (
        <div>
          <Space direction={"horizontal"} style={{width: '100%'}}>
            { text }
            <Progress type="circle"
                      width={50}
                      status={"active"}
                      percent={Math.round((parseFloat(text) / total) * 100)}
                      format={percent => `${percent}%`}
            />
          </Space>
        </div>
      )
    }
  }
}

function getColumn(tile: Tile, tileEntries: TileEntry[], averaged: boolean) {
  switch(tile.type) {
    case "ASSIGNMENTS":
    case "EXTERNAL_DATA":
      switch(tile.content) {
        case "ENTRIES":
          return entriesColumns(tile, tileEntries, averaged);
        case "BINARY":
          return binaryColumn(tile, tileEntries);
        default:
          return entriesColumns(tile, tileEntries, averaged);
      }
    case "DISCUSSIONS":
      return entriesColumns(tile, tileEntries, averaged);
  }
}

export function getColumns(tiles: Tile[], tileEntries: TileEntry[], averaged: boolean): any {
  let columns = [];
  const standardColumns: ColumnsType<CanvasStudent> = [{
    title: "Student",
    key: "name",
    dataIndex: "name",
    fixed: true,
    width: 200,
    sorter: (a, b) => a.name.localeCompare(b.name),
    defaultSortOrder: 'ascend',
    render: (text: string, record: any) => {
      return (
        <span>{ text }<br /><small>{ record.student.login_id}</small></span>
      )
    }
  }];

  const tileColumns = tiles.filter(t => !['PREDICTION', 'LEARNING_OUTCOMES'].includes(t.content)).map(t => getColumn(
    t, tileEntries.filter(e => e.tile_id === t.id), averaged
    )).filter(element => element !== undefined);

  columns.push(...standardColumns, ...tileColumns);

  return columns;
}

function getEntryKey(entry: TileEntry, tiles: Tile[]): string {
  const tile: Tile = tiles.find(t => t.id === entry.tile_id)!;
  switch(tile.content) {
    case "BINARY": return entry.tile_id.toString();
    default:
      return `${entry.tile_id}_${entry.id}`;
  }
}

export function getData(students: CanvasStudent[],
                        tiles: Tile[],
                        entries: TileEntry[],
                        submissions: TileEntrySubmission[],
                        discussions: CanvasDiscussion[]): object[] {

  return students.map(student => ({
    student,
    key: student.id,
    name: student.name,
    ...Object.fromEntries(tiles.map(t => {
      const tileEntries = entries.filter(e => e.tile_id === t.id);

      if (t.content === "BINARY") {
        let grade = submissions.filter(
          s => s.user_login_id === student.login_id &&
            tileEntries.map(e => e.id).includes(s.entry_id)
        ).map(s => parseInt(s.grade)).filter(s => s === 1).length.toString();
        return [[t.id, grade]];
      }

      if (t.type === "DISCUSSIONS") {
        return tileEntries.map(e => {
          const entry_discussions = discussions.filter(disc => disc.title === e.title && disc.posted_by === student.name);
          return [getEntryKey(e, tiles), entry_discussions.length];
        })
      }

      return tileEntries.map(e => {
        const submission = submissions.find(
          s => s.entry_id === e.id && s.user_login_id === student.login_id
        )!;
        return [getEntryKey(e, tiles), submission ? submission.grade : ""];
      })
    }).flat()),
  }));
}