import React, { Component } from "react";
import {IProps, IState} from "./types";
import ActionButtons from "./ActionButtons";
import {Row, Col, Divider, Tag, Tooltip, Button} from "antd";
import {BellTwoTone} from "@ant-design/icons";
import ContentType from "./ContentType";
import TileType from "./TileType";
import TileController from "../../api/controllers/tile";
import {Draggable} from "react-smooth-dnd";
import "./style.scss";
import {RootState} from "../../store";
import {TileActions} from "../../store/actions/tiles";
import {connect, ConnectedProps} from "react-redux";
import {Tile} from "../../models/app/Tile";
import {ThunkDispatch} from "redux-thunk";

const mapState = (state: RootState) => ({
  tiles: state.tiles,
  tileEntries: state.tileEntries
});

const mapDispatch = ( dispatch: ThunkDispatch<any, any, any> ): any => {
  return {
    updateTile: async (tile: Tile) => dispatch(await TileActions.updateTile(tile))
    //signIn: (credentials: LoginCredentials) => dispatch(signIn(credentials))
  };
};

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = IProps & PropsFromRedux;

class DraggableTile extends Component<Props, IState> {

  state = {
    tile: undefined,
    entriesLoaded: false,
    entries: [],
    updatingNotifications: []
  }

  componentDidMount(): void {
    this.setState({tile: this.props.tile});
    TileController.getTileEntries(this.props.tile.id).then(entries => {
      this.setState({ entries, entriesLoaded: true });
    });
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const { tile }: IState = this.state;
    if (tile !== undefined && prevProps.tile.id !== tile!.id) {
      TileController.getTileEntries(tile!.id).then(entries => {
        this.setState({ entries, entriesLoaded: true });
      });
    }
  }

  toggleNotifications = async (tile: Tile) => {
    const { updatingNotifications }: IState = this.state;
    this.setState({ updatingNotifications: [...updatingNotifications, tile.id]}, () => {
      tile.notifications = !tile.notifications;
      TileController.updateTile(tile).then(async t => {
        this.props.updateTile(t);
        this.setState({
          updatingNotifications: updatingNotifications
            .filter(x => x !== tile.id),
          tile: t
        });
      })
    });
  }

  render(): React.ReactNode {
    const { tile, entriesLoaded, entries, updatingNotifications }: IState = this.state;

    if (!tile) return null;

    return (
      <Draggable key={'dragTile' + tile!.id.toString()} className={"tile"}>
        <div>
          <div className={"padded"}>
            <ActionButtons {...{tile, editTile: this.props.editTile}} />
            <h3>{ tile!.title }</h3>
            <Row gutter={10} style={{ marginTop: 20 }}>
              <Col xs={12}>
                <span>Content type</span>
                <ContentType content={tile!.content} />
              </Col>

              <Col xs={12} style={{ textAlign: 'right' }}>
                <span>Tile type</span>
                <TileType type={tile!.type} />
              </Col>

              <Col xs={24} style={{ margin: "20px 0" }}>
                <Divider />
              </Col>

              <Col xs={18}>
                <div>
                  { entriesLoaded ?
                    <span>
                      <Tag key={'tileTag' + tile!.id.toString()}>
                        { entries.length }
                      </Tag>
                      children
                    </span> :
                    <span>Loading entries...</span>
                  }
                </div>
              </Col>

              <Col xs={6}>
                <Tooltip key={`tooltipTile#${tile!.id}`}
                         title={<span>Notifications are turned <strong>{ tile!.notifications ? "on" : "off"}</strong>.</span>}>
                  <Button type={"ghost"}
                          key={`toggleNotificationsTile#${tile!.id}`}
                          loading={updatingNotifications.includes(tile!.id)}
                          style={{ float: 'right' }}
                          shape="circle"
                          icon={<BellTwoTone twoToneColor={tile!.notifications ? "rgb(0, 185, 120)" : "rgb(255, 110, 90)"} />}
                          onClick={() => this.toggleNotifications(tile)}
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>
        </div>
      </Draggable>
    );
  }
}

export default connector(DraggableTile);