import React, { Component } from "react";
import {Alert, Button, Divider, Input, Space} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import GoalRequirement from "./GoalRequirement";
import {GoalRequirement as GoalRequirementModel} from "../../../../../models/app/LearningGoal";
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

  updateRequirement = (requirement: GoalRequirementModel) => {
    let goal: LearningGoal = JSON.parse(JSON.stringify(this.props.goal));
    const id = goal.requirements.findIndex(r => r.id === requirement.id)!;
    goal.requirements[id] = requirement;

    this.props.updateGoal(goal);
  }

  removeRequirement = (id: number) => {
    let { goal } = this.props;
    goal.requirements = goal.requirements.filter(r => r.id !== id);

    this.props.updateGoal(goal);
  }

  render(): React.ReactNode {
    let { goal, tile } = this.props;

    return (
      <div className={"goalEntry"}>
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
                        text: `Goal: ${goal.title}`,
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.props.removeGoal(goal.id);
                        }
                      });
                    }}
                    icon={<DeleteOutlined />}>
              Delete goal
            </Button>

            <Button shape={"round"}
                    onClick={() => {
                      goal.requirements = [{
                        id: generateUniqueID(goal.requirements.map(r => r.id)),
                        expression: null,
                        goal_id: goal.id,
                        tile_id: tile ? tile.id : -1,
                        entry_id: -1,
                        meta_key: "grade",
                        value: 0
                      }, ...goal.requirements];
                      this.props.updateGoal(goal);
                    }}
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
                             removeRequirement={this.removeRequirement}
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