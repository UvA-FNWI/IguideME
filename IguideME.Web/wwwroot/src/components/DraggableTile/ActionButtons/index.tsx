import React, { Component } from "react";
import {Dropdown, MenuProps, Spin} from "antd";
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
    tile: null
  }

  handleMenuClick: MenuProps['onClick'] = (e) => {
    switch(e.key) {
      case "1":
        this.props.editTile()
        return;
      case "2":
        let tile: any = this.state.tile;
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
        return;
    }
  };

  items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: '1',
      icon: <EditOutlined />,
    },
    {
      label: 'Delete',
      key: '2',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];


  componentDidMount(): void {
    this.setState({ tile: this.props.tile });
  }

  render(): React.ReactNode {

    let { tile, loading }: IState = this.state;

    if (!tile) return null;
    tile = tile as Tile;

    return (
      <div style={{float: 'right'}}>
        <Dropdown.Button  menu={{items: this.items, onClick: this.handleMenuClick}}
                          buttonsRender={([leftButton, rightButton]) => {
                            let name = loading ? "" : (tile!.visible ? "successButton" : "dangerButton");
                            return [
                                React.cloneElement(leftButton as React.ReactElement<any, string>, {className: name }),
                                rightButton
                            ]
                          }}
                          onClick={() => {
                            this.setState({ loading: true }, () => {
                              let t = tile!;
                              t.visible = !t.visible;
                              TileController.updateTile(t).then(async newTile => {
                                await (this.props as any).updateTile(newTile);
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