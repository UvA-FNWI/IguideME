import React, { Component } from "react";
import {Button, Col, InputNumber, Row} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import Select from "react-select";
import {IProps} from "./types";
import Swal from "sweetalert2";
import {RootState} from "../../../../../../store";
import {connect, ConnectedProps} from "react-redux";
import "./style.scss";
import TileController from "../../../../../../api/controllers/tile";

const mapState = (state: RootState) => ({
  tiles: state.tiles,
  tileEntries: state.tileEntries
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = IProps & PropsFromRedux;

class GoalRequirement extends Component<Props> {

  state = {
    loading: false,
    metaKeys: []
  }

  componentDidMount(): void {
    const { requirement } = this.props;

    if (requirement.entry_id !== -1) {
      this.loadMetaKeys(requirement.entry_id);
    }
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.requirement.entry_id !== this.props.requirement.entry_id) {
      this.loadMetaKeys(nextProps.requirement.entry_id);
    }

    if (nextProps.requirement.entry_id === -1) {
      this.setState({
        loading: false, metaKeys: []
      });
    }
  }

  loadMetaKeys = (id: number) => {
    this.setState({ loading: true }, () => {
      TileController.getTileEntriesMetaKeys(id).then(metaKeys => {
        this.setState({
          loading: false, metaKeys
        });
      });
    });
  }

  getExpressionLabel = (expression: "lte" | "gte" | "e" | null) => {
    switch (expression) {
      case "lte": return "≤";
      case "gte": return "≥";
      case "e": return "=";
      default: return "";
    }
  }

  getMetaKeyLabel = (key: string) => {
    switch (key) {
      case "grade": return "Grade (default)";
      default: return key;
    }
  }

  render(): React.ReactNode {
    let { requirement, tiles, tileEntries } = this.props;

    return (
      <div className={"goalRequirement"}>
        <Row gutter={[10, 10]}>
          <Col xs={3} md={2}>
            <Button shape={"circle"}
                    danger
                    onClick={() => {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Do you really want to delete this requirement?',
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.props.removeRequirement(requirement.id)
                        }
                      });
                    }}
                    icon={<DeleteOutlined />}/>
          </Col>
          <Col xs={21} md={8}>
            Tile
            <Select value={{
                      value: requirement.tile_id,
                      label: tiles.find(t => t.id === requirement.tile_id)?.title || "Choose tile"
                    }}
                    options={tiles.map(t => ({ value: t.id, label: t.title }))}
                    onChange={(e) => {
                      if (!e) return;

                      let r = JSON.parse(JSON.stringify(requirement));
                      r.tile_id = e.value;
                      r.entry_id = -1;
                      this.props.updateRequirement(r);
                    }}
            />
          </Col>
          <Col xs={24} md={8}>
            Entry
            <Select value={{
                      value: requirement.entry_id,
                      label: tileEntries.find(e => e.id === requirement.entry_id)?.title || "Choose entry"
                    }}
                    isDisabled={requirement.tile_id === -1}
                    onChange={(e) => {
                      if (!e) return;

                      let r = JSON.parse(JSON.stringify(requirement));
                      r.entry_id = e.value;
                      this.props.updateRequirement(r);
                    }}
                    options={tileEntries
                      .filter(e => e.tile_id === requirement.tile_id)
                      .map(e => ({ label: e.title, value: e.id }))} />
            <br />
            Meta
            <Select isLoading={this.state.loading}
                    value={{ value: requirement.meta_key, label: this.getMetaKeyLabel(requirement.meta_key) }}
                    onChange={e => {
                      if (!e) return;
                      let r = JSON.parse(JSON.stringify(requirement));
                      r.meta_key = e.value;
                      this.props.updateRequirement(r);
                    }}
                    isDisabled={requirement.entry_id === -1}
                    options={[
                      { value: 'grade', label: 'Grade (default)' },
                      ...this.state.metaKeys.map(k => ({
                        value: k, label: k
                      }))
                    ]} />
          </Col>
          <Col xs={24} md={3}>
            Expression
            <Select isDisabled={requirement.entry_id === -1}
                    value={requirement.expression ? { label: this.getExpressionLabel(requirement.expression), value: requirement.expression } : undefined}
                    onChange={e => {
                      if (!e) return;

                      let r = JSON.parse(JSON.stringify(requirement));
                      r.expression = e.value;
                      this.props.updateRequirement(r);
                    }}
                    options={[
                      { value: 'lte', label: '≤' },
                      { value: 'e', label: '=' },
                      { value: 'gte', label: '≥' }
                    ]}
            />
          </Col>
          <Col xs={24} md={3}>
            <br />
            <InputNumber step={.5}
                         size={"large"}
                         disabled={requirement.expression === null}
                         value={requirement.value}
                         onChange={e => {
                           let r = JSON.parse(JSON.stringify(requirement));
                           r.value = e;
                           this.props.updateRequirement(r);
                         }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connector(GoalRequirement);