import React, { Component } from "react";
import {Col, Drawer, Input, Row, Statistic, Divider, Button} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {IProps, IState} from "./types";
import Select from "react-select";
import TileCreateEntries from "../../../../../../components/managers/TileCreateEntries";
import {editState, Tile, TileContentTypes, TileEntry, TileTypeTypes} from "../../../../../../models/app/Tile";
import VisibilityButton from "./VisibilityButton";
import {RootState} from "../../../../../../store";
import {connect, ConnectedProps} from "react-redux";
import TileController from "../../../../../../api/controllers/tile";
import {TileActions} from "../../../../../../store/actions/tiles";

const mapState = (state: RootState) => ({
  tileEntries: state.tileEntries,
  tileGoals: state.tileGoals
});

const mapDispatch = {
  loadTiles: () => TileActions.loadTiles(),
  loadEntries: () => TileActions.loadTileEntries(),
  loadTileGoals: () => TileActions.loadTileGoals()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = IProps & PropsFromRedux;

class EditTileDragger extends Component<Props, IState> {

  state = {
    updating: false,
    title: "",
    contentType: { label: undefined, value: undefined },
    tileType: { label: undefined, value: undefined },
    visible: true,
    wildcard: false,
    entries: [],
    goals: [],
    graphView: false,
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.tile !== undefined && nextProps.tile.id !== this.props.tile?.id) {
      const { tile } = nextProps;

      if (tile) {
        this.setState({
          title: tile.title,
          contentType: { label: tile.content, value: tile.content },
          tileType: { label: tile.type!, value: tile.type },
          visible: tile.visible,
          graphView: tile.graph_view
        });
      }
    } else if (nextProps.tile === undefined) {
      this.setState({
        title: "",
        contentType: { label: undefined, value: undefined },
        tileType: { label: undefined, value: undefined },
        visible: false,
        graphView: false
      });
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (!prevProps.isOpen && this.props.isOpen) {
      window.scrollTo(0, 0);
    }
  }

  create = async () => {
    const { entries, title, visible, contentType, tileType, wildcard, goals, graphView }: IState = this.state;
    const { tileGroup } = this.props;

    const newTile: Tile = {
      id: -1,
      group_id: tileGroup.id,
      title,
      position: -1,
      visible,
      content: contentType.value as TileContentTypes,
      type: tileType.value as TileTypeTypes,
      notifications: false,
      graph_view: graphView,
      wildcard
    }

    TileController.createTile(newTile).then(async tile => {
      if (['ASSIGNMENTS', 'DISCUSSIONS'].includes(tile.type || "")) {
        await this.createEntries(entries.map(e => {
          e.tile_id = tile.id;
          return e;
        }));
      } else if (tile.content === "LEARNING_OUTCOMES") {
        for (var i = 0; i < goals.length; i++) {
          goals[i].tile_id = tile.id;
          var response = await TileController.createTileGoal(goals[i]);
          console.log("goal", response)
        }
      }

      this.props.loadTiles().then(() => {
        this.props.loadEntries().then(() => {
          this.props.loadTileGoals().then(() => {
            this.setState({ updating: false }, () => {
              this.props.setOpen(false);
            });
          });
        });
      });
    });
  }

  save = async () => {
    const { entries, goals, graphView, wildcard, title }: IState = this.state;
    const { tileEntries, tile }: Props = this.props;

    // let tileRef = JSON.parse(JSON.stringify(tile!));
    tile!.title = title;
    tile!.graph_view = graphView;
    tile!.wildcard = wildcard;

    const patchedTile = await TileController.updateTile(tile!)
    this.setState({ updating: true }, async () => {
      var removedEntries = tileEntries.filter(
        e => e.tile_id === ( tile ? tile.id : -1 )
      ).filter(
        e => !entries.map(_e => _e.title).includes(e.title));

      var newEntries = entries.filter(e => e.id === -1);

      console.log("Tile type", tile!.type);
      console.log("Goals lengt", goals.length);

      if (tile!.type === 'ASSIGNMENTS' || tile!.type === 'DISCUSSIONS' ) {
        removedEntries = tileEntries.filter(
          e => e.tile_id === patchedTile.id
        ).filter(
          e => !entries.map(_e => _e.title).includes(e.title));

        newEntries = entries.filter(e => e.id === -1);

      }
      else if (tile!.content === "LEARNING_OUTCOMES") {
        for (var i = 0; i < goals.length; i++) {
          if (goals[i].state != null) {
            switch (goals[i].state) {
              case editState.new:
                goals[i].state = editState.unchanged;
                await TileController.createTileGoal(goals[i]);
                break;
              case editState.updated:
                goals[i].state = editState.unchanged;
                await TileController.updateTileGoal(goals[i]);
                break;
              case editState.removed:
                goals[i].state = editState.unchanged;
                await TileController.deleteTileGoal(goals[i].id);
                break;
              case editState.unchanged:
                break;
            }
          }
        }
      }

      await this.deleteEntries(removedEntries);
      await this.createEntries(newEntries);

      this.props.loadTiles().then(() => {
        this.props.loadEntries().then(() => {
          this.props.loadTileGoals().then(() => {
            this.setState({ updating: false }, () => {
              this.props.setOpen(false);
            });
          });
        });
      });
    });
  }

  createEntries = async (entries: TileEntry[]) => {
    for (const entry of entries) {
      await TileController.createTileEntry(entry);
    }
  }

  deleteEntries = async (entries: TileEntry[]) => {
    for (const entry of entries) {
      await TileController.deleteTileEntry(entry.id);
    }
  }

  render(): React.ReactNode {
    const { tileGroup, tiles, tile } = this.props;
    const { title, contentType, tileType, visible }: IState = this.state;

    return (
      <Drawer
        width={'100%'}
        destroyOnClose={true}
        title={tile === undefined ? "Create new tile" : "Edit " + tile.title}
        placement={"right"}
        closable={true}
        onClose={() => this.props.setOpen(false)}
        visible={this.props.isOpen}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <Row gutter={[10, 25]} style={{marginBottom: 10}}>
          <Col xs={24}>
            <Row gutter={50}>
              <Col>
                <Statistic
                  title={"Tile Group"}
                  value={tileGroup.title}
                />
              </Col>
              <Col>
                <Statistic
                  title={"Children"}
                  value={tiles.filter(t => t.group_id === tileGroup.id).length}
                  suffix={"tiles"}
                />
              </Col>
              <Col>
                <Statistic
                  title={"Manage"}
                  valueRender={() => (
                    <Button type="primary"
                            shape="round"
                            loading={this.state.updating}
                            onClick={() => this.props.tile === undefined ? this.create() : this.save()}
                            icon={<SaveOutlined />}>
                      { this.props.tile === undefined ? "Create" : "Save" }
                    </Button>)
                  }
                />
              </Col>
            </Row>

            <Divider />
            <h2>Tile Configuration</h2>
          </Col>

          <Col xs={12}>
            <span>Title</span>
            <Input size={"large"}
                   placeholder={"Specify"}
                   value={title}
                   onChange={e => this.setState({ title: e.target.value })}/>
          </Col>
          <Col xs={12}>
            <span>Visibility</span>
            <br />
            <VisibilityButton visible={visible}
                              setVisibility={visible => this.setState({ visible })}
            />
          </Col>

          <Col xs={12}>
            <span>Content type</span>
            <Select value={{label: contentType.label as string, value: contentType.value as string}}
                    style={{zIndex: 100}}
                    options={[
                      { label: 'Binary', value: 'BINARY'},
                      { label: 'Entries', value: 'ENTRIES' },
                      { label: 'Prediction', value: 'PREDICTION' },
                      { label: 'Learning Outcome', value: 'LEARNING_OUTCOMES' }
                    ]}
                    isClearable={true}
                    onChange={e => {
                      if (!e) {
                        this.setState({
                          contentType: {label: undefined, value: undefined},
                          tileType: {label: undefined, value: undefined}
                        });
                      } else {
                        this.setState({
                          contentType: {
                            label: e!.label,
                            value: e!.value as TileContentTypes
                          },
                          tileType: {label: undefined, value: undefined}
                        });
                      }
                    }
                  }
            />
          </Col>

          <Col xs={12}>
            <span>Tile type</span>
            { ((contentType.value === "LEARNING_OUTCOMES") || (contentType.value === "PREDICTION")) ?
              <h3>N/A</h3> :
              <Select value={{label: tileType.label as string, value: tileType.value as string}}
                      isDisabled={!contentType}
                      isClearable={true}
                      style={{zIndex: 100}}
                      options={[
                        { label: 'Assignments', value: 'ASSIGNMENTS'},
                        { label: 'Discussions', value: 'DISCUSSIONS', isDisabled: (contentType ? contentType!.value : "") !== "ENTRIES" },
                        { label: 'External Data', value: 'EXTERNAL_DATA' }
                      ]}
                      onChange={e => this.setState({ tileType: e ? {
                          label: e.label,
                          value: e.value as TileTypeTypes
                        } : { label: undefined, value: undefined } })
                      }
                      placeholder={
                        contentType ? "Select type" : "Specify content first"
                      }
              />
            }
          </Col>
        </Row>

        <TileCreateEntries tile={tile}
                           graphView={this.state.graphView}
                           setGraphView={(graphView) => this.setState({ graphView })}
                           wildcard={this.state.wildcard}
                           setWildcard={wildcard => this.setState({ wildcard })}
                           updateEntries={(entries) => this.setState({ entries })}
                           updateGoals={(goals) => this.setState({ goals })}
                           contentType={this.state.contentType.value}
                           tileType={this.state.tileType.value}
        />
      </Drawer>
    )
  }
}

export default connector(EditTileDragger);