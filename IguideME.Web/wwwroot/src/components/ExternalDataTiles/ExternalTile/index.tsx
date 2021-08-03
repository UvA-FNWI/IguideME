import React, { Component } from "react";
import {IProps, IState} from "./types";
import UploadBinaryData from "../../upload/UploadBinaryData";
import {Button, Tag} from "antd";
import FadeIn from "react-fade-in";
import HistoricUploads from "./HistoricUploads";

export default class ExternalTile extends Component<IProps, IState> {

  state = { uploadMenuOpen: false }

  render(): React.ReactNode {
    const { tileGroup, tile } = this.props;
    const { uploadMenuOpen } = this.state;

    return (
      <div className={"primaryContainer externalTile"} style={{marginBottom: 20}}>
        <h2><b>{ tile.title }</b> <Tag>{ tileGroup.title }</Tag></h2>

        { uploadMenuOpen ?
          <FadeIn>
            <UploadBinaryData closeUploadMenu={() => this.setState({ uploadMenuOpen: false })} />
          </FadeIn> :
          <Button className={"successButton"}
                  style={{float: 'right'}}
                  onClick={() => this.setState({ uploadMenuOpen: true })}
          >
            New Upload
          </Button>
        }

        <HistoricUploads tile={tile} />
      </div>
    )
  }
}