import React, { ChangeEvent, Component } from "react";
import {Button, Col, InputNumber, Row} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import Select from "react-select";
import {IProps} from "./types";
import Swal from "sweetalert2";
import {RootState} from "../../../../../../store";
import {connect, ConnectedProps} from "react-redux";
import TileController from "../../../../../../api/controllers/tile";
import "./style.scss";
import { register } from "../../../../../../serviceWorker";
import { editState } from "../../../../../../models/app/Tile";

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
    if (requirement.entry_id !== -1 && requirement.entry_id !== null) {
      this.loadMetaKeys(requirement.entry_id as number);
    }
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.requirement.entry_id !== this.props.requirement.entry_id &&
        !isNaN(nextProps.requirement.entry_id as number)) {
      this.loadMetaKeys(nextProps.requirement.entry_id as number);
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

  getExpressionLabel = (expression: string | null) => {
    switch (expression) {
      case "lte": return "≤ (less than)";
      case "gte": return "≥ (greater than)";
      case "e": return "= (equal to)";
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

    let entryOptions: {label: string, value: number | string }[] = tileEntries
      .filter(e => e.tile_id === requirement.tile_id)
      .map(e => ({ label: e.title, value: e.id }));

    const targetTile = tiles.find(t => t.id === requirement.tile_id);
    if (targetTile && targetTile.content === "BINARY") {
      entryOptions = [
        { value: 'count', label: 'COUNT (success)' },
        ...entryOptions
      ];
    }

    if (requirement.state == editState.removed) {
      return null;
    }

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
                          requirement.state = editState.removed;
                          this.props.updateRequirement(requirement);
                          this.setState({requirement});
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

                      requirement.tile_id = e.value;
                      requirement.entry_id = -1;
                      this.props.updateRequirement(requirement);
                      this.setState({requirement});
                    }}
            />
          </Col>
          <Col xs={24} md={8}>
            Entry
            <Select value={{
                      value: requirement.entry_id,
                      label: requirement.entry_id === "count" ?
                        "COUNT (success)" :
                        (tileEntries.find(e => e.id === requirement.entry_id)?.title || "Choose entry")
                    }}
                    isDisabled={requirement.tile_id === -1}
                    onChange={(e) => {
                      if (!e) return;

                      requirement.entry_id = e.value;
                      this.props.updateRequirement(requirement);
                      this.setState({requirement});

                    }}
                    options={entryOptions} />
            <br />
            Meta
            <Select isLoading={this.state.loading}
                    value={{ value: requirement.meta_key || "", label: this.getMetaKeyLabel(requirement.meta_key || "") }}
                    onChange={e => {
                      if (!e) return;
                      requirement.meta_key = e.value;
                      this.props.updateRequirement(requirement);
                      this.setState({requirement});
                    }}
                    isDisabled={requirement.entry_id === -1 || requirement.entry_id === "count"}
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

                      requirement.expression = e.value;
                      this.props.updateRequirement(requirement);
                      this.setState({requirement});
                    }}
                    options={[
                      { value: 'lte', label: '≤ (less than)' },
                      { value: 'e', label: '= (equal to)' },
                      { value: 'gte', label: '≥ (greater than)' }
                    ]}
            />
          </Col>
          <Col xs={24} md={3}>
            <br />
            <InputNumber step={.5}
                         size={"large"}
                         disabled={requirement.expression === null}
                         value={requirement.value}
                         onChange={value => {
                          requirement.value = Number(value);
                          this.props.updateRequirement(requirement);
                          this.setState({requirement});
                        }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connector(GoalRequirement);