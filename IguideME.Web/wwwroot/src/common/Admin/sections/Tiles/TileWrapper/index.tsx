import React, { Component } from "react";
import { IProps, IState } from "./types";
import {Button, Space} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import DraggableTile from "../../../../../components/DraggableTile";
import EditTileDragger from "./EditTileDragger";
import {Container} from "react-smooth-dnd";
import {getStyle, getTilesInGroup, handleDrop} from "./helpers";
import {Tile} from "../../../../../models/app/Tile";
import "./style.scss";
import Swal from "sweetalert2";
import TileController from "../../../../../api/controllers/tile";
import {RootState} from "../../../../../store";
import {TileActions} from "../../../../../store/actions/tiles";
import {connect, ConnectedProps} from "react-redux";

const mapState = (state: RootState) => ({
  tileGroups: state.tileGroups,
});

const mapDispatch = {
  loadGroups: () => TileActions.loadGroups(),
  loadTiles: () => TileActions.loadTiles()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = IProps & PropsFromRedux;

class TileWrapper extends Component<Props, IState> {

  state = {
    updating: [],
    editTile: undefined,
    isDraggerOpen: false
  }

  deleteTile = async (id: number) => {
    TileController.deleteTile(id).then(() => {
      this.props.loadGroups().then(() => {
        this.props.loadTiles().then(() => {
          this.setState({isDraggerOpen: false});
        });
      });
    });
  }


  render(): React.ReactNode {
    const { editTile, isDraggerOpen, updating }: IState = this.state;
    const { group, tiles, updateTiles } = this.props;
    const historicTiles: Tile[] = JSON.parse(JSON.stringify(tiles));

    return (
      <div className={"tileWrapper"} key={"group-" + group.id.toString()}>
        <h2>{ group.title }</h2>
        <div className={"tileContainer"}>
          <EditTileDragger
            tile={editTile}
            tiles={tiles}
            tileGroup={group}
            isOpen={isDraggerOpen}
            setOpen={(isDraggerOpen) => this.setState({ isDraggerOpen })}
            updateTiles={updateTiles}
          />

          <Container groupName={`primary`}
                     key={"containerGroup" + group.id.toString()}
                     style={{...getStyle(group, tiles)}}
                     getChildPayload={i => getTilesInGroup(tiles, group.id)[i]}
                     orientation={"horizontal"}
                     dragClass={'dragged'}
                     onDrop={e => {
                       handleDrop(group, e, tiles).then(async (newTiles: Tile[]) => {
                         if (newTiles.map(t => {
                           const target = historicTiles.find(_t => _t.id === t.id);
                           if (!target) return false;
                           return (target.group_id !== t.group_id || target.position !== t.position);
                         }).some(x => x)) {
                           this.setState({ updating: [...updating, group.id] }, async () => {
                             const changedTiles = newTiles.filter(t => {
                               const target = historicTiles.find(ht => ht.id === t.id);
                               if (!target) return true;

                               return target.position !== t.position || target.group_id !== t.group_id;
                             });

                             for (const tile of changedTiles) {
                               await TileController.updateTile(tile);
                             }

                             TileController.getTiles().then(async fetchedTiles => {
                               await updateTiles(fetchedTiles);

                               this.setState({ updating: updating.filter(x => x !== group.id)});
                             })
                           });
                         }
                       })
                     }}>
            <div className={"updateOverlay " + (updating.includes(group.id) ? "active" : "")}>
              <div className={"overlayBackground"} />
              <h1>Saving changes...</h1>
            </div>
            { tiles.sort((a, b) => a.position - b.position).map(t => {
              return (
                <DraggableTile key={"dragMem" + t.id.toString()} {...{
                  tile: t, editTile: () => this.setState({editTile: t, isDraggerOpen: true}), deleteTile: this.deleteTile
                }} />
              );
            })}
          </Container>

          <br />

          <Space direction={"horizontal"}>
            <Button type={"link"}
                    onClick={() => this.setState({
                      isDraggerOpen: true,
                      editTile: undefined,
                    })}
                    icon={<PlusOutlined />}>
              Create Tile
            </Button>
            <Button type={"link"}
                    danger={true}
                    onClick={() => {
                      Swal.fire({
                        title: 'Do you really want to delete this group?',
                        text: 'All tiles within this group will be deleted as a result.',
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        confirmButtonColor: 'rgb(255, 110, 90)',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          TileController.deleteTileGroup(group.id).then(() => {
                            this.props.loadGroups().then(() => {
                              Swal.fire('Task completed!', '', 'success');
                            });
                          });
                        }
                      });
                    }}
                    icon={<DeleteOutlined />}>
              Delete Group
            </Button>
          </Space>
        </div>
      </div>
    )
  }
}

export default connector(TileWrapper);