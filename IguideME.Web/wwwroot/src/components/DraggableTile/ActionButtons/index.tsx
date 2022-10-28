import React, { Component } from "react";
import {Dropdown, Menu, Spin} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IProps, IState } from "./types";
import {RootState} from "../../../store";
import {ThunkDispatch} from "redux-thunk";
import {Tile} from "../../../models/app/Tile";
import {TileActions} from "../../../store/actions/tiles";
import {connect, ConnectedProps} from "react-redux";
import TileController from "../../../api/controllers/tile";
import Swal from "sweetalert2";

const mapState = (state: RootState) => ({
  tiles: state.tiles,
});

const mapDispatch = (dispatch: ThunkDispatch<any, any, any>): any => {
  return {
    updateTile: async (tile: Tile) => dispatch(await TileActions.updateTile(tile))
  };
};

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = IProps & PropsFromRedux;

class ActionButtons extends Component<Props, IState> {

  state = {
    loading: false,
    tile: undefined
  }

  componentDidMount(): void {
    this.setState({ tile: this.props.tile });
  }

  render(): React.ReactNode {
    const menu = (
      <Menu onClick={() => {}}>
        <Menu.Item key="1" icon={<EditOutlined />} onClick={this.props.editTile}>
          Edit
        </Menu.Item>
        <Menu.Item key="2" icon={<DeleteOutlined />} onClick={() => {
            Swal.fire({
              title: 'Do you really want to delete this tile?',
              showCancelButton: true,
              confirmButtonText: 'Delete',
              confirmButtonColor: 'rgb(255, 110, 90)',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.deleteTile(tile!.id).then(() => [
                  Swal.fire('Task completed!', '', 'success')
                ]);
              }
            })
          }
        } danger>
          Delete
        </Menu.Item>
      </Menu>
    );

    const { tile, loading }: IState = this.state;

    if (!tile) return null;

    return (
      <div style={{float: 'right'}}>
        <Dropdown.Button overlay={menu}
                         className={loading ? "" : (tile!.visible ? "successButtonGroup" : "dangerButtonGroup")}
                         onClick={() => {
                           this.setState({ loading: true }, () => {
                             let t = tile!;
                             t.visible = !t.visible;
                             TileController.updateTile(t).then(async newTile => {
                               await this.props.updateTile(newTile);
                               this.setState({ tile: t, loading: false });
                             });
                           });
                         }}
        >
          { loading ?
            <Spin size={'small'} /> :
            (tile!.visible ? "Visible" : "Hidden")
          }
        </Dropdown.Button>
      </div>
    );
  }
}

export default connector(ActionButtons);