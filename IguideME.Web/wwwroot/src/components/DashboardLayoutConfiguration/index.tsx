import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Alert, Button, Col, Divider, Row} from "antd";
import Column from "./Column";
import LayoutController from "../../api/controllers/layout";
import TileController from "../../api/controllers/tile";
import Loading from "../utils/Loading";
import {TileGroup} from "../../models/app/Tile";
import {DashboardColumnWidth} from "../../models/app/Layout";

export default class DashboardLayoutConfiguration extends Component<IProps, IState> {

  state = { loaded: false, columns: [], tileGroups: [] };

  componentDidMount(): void {
    LayoutController.getColumns().then(columns => {
      TileController.getTileGroups().then(tileGroups => {
        this.setState({ loaded: true, columns, tileGroups });
      });
    });
  }

  render() {
    const { columns, tileGroups, loaded }: IState = this.state;

    if (!loaded) return <Loading small={true} />;

    return (
      <div id={"dashboardLayout"}>
        <Button onClick={() => {
          LayoutController.createColumn({
            id: -1,
            position: columns.length + 1,
            container_width: "middle" as DashboardColumnWidth
          }).then((newColumn) => {
            this.setState({ columns: [...columns, newColumn] });
          })
        }}>
          Add Column
        </Button>

        <Divider />

        { columns
          .sort((a, b) => a.position - b.position)
          .map((c, i) => {
          return (
            <Column number={i + 1}
                    column={c}
                    allTileGroups={tileGroups}
                    tileGroups={tileGroups.filter(g => g.column_id === c.id)}
                    removeColumn={(col) => {
                      TileController.getTileGroups().then(newTileGroups => {
                        this.setState({
                          columns: columns.filter(c => c.id !== col.id),
                          tileGroups: newTileGroups
                        });
                      });
                    }}
                    updateGroup={(tileGroup: TileGroup) => {
                      TileController.updateTileGroup(tileGroup).then(newTileGroup => {
                        this.setState({
                          tileGroups: [...tileGroups.filter(tg => tg.id !== tileGroup.id), newTileGroup]
                        });
                      });
                    }}
                    update={async (column, updatedTileGroups) => {
                      if (column.container_width !== columns.find(c => c.id === column.id)!.container_width) {
                        await LayoutController.updateColumn(column);
                      }

                      const newTileGroups: TileGroup[] = updatedTileGroups
                        .filter(g => !tileGroups.map(tg => tg.id).includes(g.id));

                      let registeredGroups: TileGroup[] = [];
                      for (const group of newTileGroups) {
                        const registeredGroup = await TileController.updateTileGroup(group);
                        registeredGroups.push(registeredGroup);
                      }

                      this.setState({
                        columns: [...columns.filter(c1 => c1.id !== c.id), column],
                        tileGroups: [
                          ...tileGroups.filter(g => !newTileGroups.map(x => x.id).includes(g.id)),
                          ...newTileGroups
                        ]
                      });
                    }}
            />
          )
        })}
      </div>
    )
  }
}