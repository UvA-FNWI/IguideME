import React, { Component } from "react";
import {Alert, Button, Divider, Input, Space} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import GoalRequirement from "./GoalRequirement";
import {GoalRequirement as GoalRequirementModel} from "../../../../../models/app/LearningGoal";
import {editState} from "../../../../../models/app/Tile";
import {IProps} from "./types";
import {LearningGoal} from "../../../../../models/app/LearningGoal";
import Swal from "sweetalert2";
import {generateUniqueID} from "../helpers";
import "./style.scss";

export default class GoalEntry extends Component<IProps> {

  componentDidMount(): void {
    this._initialize(this.props.goal);
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    this._initialize(nextProps.goal);
  }

  _initialize = (goal: LearningGoal) => {
    this.setState({ goal });
  }

  addNewRequirement = () => {
    const {goal, tile} = this.props;
    goal.requirements = [{
      id: -1,
      state: editState.new,
      expression: null,
      goal_id: goal.id,
      tile_id: tile ? tile.id : -1,
      entry_id: -1,
      meta_key: "grade",
      value: 0
    }, ...goal.requirements];
    this.props.updateGoal(goal);
  }

  updateRequirement = (requirement: GoalRequirementModel) => {
    if ((requirement.state !== editState.new) && (requirement.state !== editState.removed)) {
      requirement.state = editState.updated;
    }
    this.props.updateGoal(this.props.goal);
    this.setState({goal: this.props.goal});
  }

  render(): React.ReactNode {
    let { goal, tile } = this.props;

    if (goal.state == editState.removed) {
      return null;
    }

    return (
      <div className={"goalEntry"} >
        <div className={"title"}>
          <span><b>Title</b></span>
          <Input value={goal.title}
                 size={"large"}
                 onChange={e => {
                   goal.title = e.target.value;
                   this.props.updateGoal(goal);
                 }}
          />
        </div>

        <div className={"actions"}>
          <Space direction={"horizontal"}>
            <Button shape={"round"}
                    danger
                    onClick={() => {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Do you really want to delete this goal?',
                        text: `Goal: ${goal.title} will be deleted on save`,
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                          goal.state = editState.removed;
                          this.setState({goal});
                        }
                      });
                    }}
                    icon={<DeleteOutlined />}>
              Delete goal
            </Button>

            <Button shape={"round"}
                    onClick={this.addNewRequirement}
                    icon={<PlusOutlined />}>
              Requirement
            </Button>
          </Space>
        </div>

        <Divider />
        <span><b>Requirements</b></span>

        { goal.requirements.map(r => {
          return (
            <GoalRequirement updateRequirement={this.updateRequirement}
                             requirement={r} />
          );
        })}

        { goal.requirements.length === 0 &&
          <Alert message="Goal doesn't have a requirement" type="warning" showIcon />
        }
      </div>
    );
  }
}