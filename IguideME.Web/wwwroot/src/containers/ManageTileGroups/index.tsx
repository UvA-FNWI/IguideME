import React, { Component } from "react";
import {Button, Drawer, Input, Space} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IState } from "./types";
import {RootState} from "../../store";
import {TileActions} from "../../store/actions/tiles";
import "./style.scss";
import TileController from "../../api/controllers/tile";
import {connect, ConnectedProps} from "react-redux";

const mapState = (state: RootState) => ({
  tileGroups: state.tileGroups,
});

const mapDispatch = {
  loadGroups: () => TileActions.loadGroups()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

class ManageTileGroups extends Component<PropsFromRedux, IState> {

  state = {
    text: "",
    drawerOpen: false
  }

  render(): React.ReactNode {
    return (
      <div id={"manageGroup"}>
        <Space direction={"horizontal"}>
          <Button icon={<PlusOutlined />}
                  className={"successButton"}
                  onClick={() => this.setState({ drawerOpen: true })}
          >
            Group
          </Button>
        </Space>
        <Drawer
          width={400}
          title={"Create tile group"}
          placement={"right"}
          closable={true}
          onClose={() => this.setState({ drawerOpen: false })}
          visible={this.state.drawerOpen}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>Provide a title for the group.</p>

          <Space style={{width: "100%"}} direction={"vertical"}>
            <Input placeholder={"Title"}
                   value={this.state.text}
                   onChange={e => this.setState({ text: e.target.value || "" })}
            />

            <Space direction={"horizontal"}>
              <Button type={"ghost"}
                      onClick={() => this.setState({ drawerOpen: false })}>
                Cancel
              </Button>
              <Button className={"successButton"}
                      onClick={() => {
                        TileController.createTileGroup(
                          this.state.text,
                          this.props.tileGroups.length).then(() => {
                            this.props.loadGroups().then(() => {
                              this.setState({ drawerOpen: false, text: "" });
                            });
                        });
                      }}>
                Create
              </Button>
            </Space>
          </Space>
        </Drawer>
      </div>
    )
  }
}

export default connector(ManageTileGroups);