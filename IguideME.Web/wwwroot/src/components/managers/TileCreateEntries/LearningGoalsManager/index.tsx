import React, { Component } from "react";
import {Button, Divider} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import GoalEntry from "./GoalEntry";
import {IProps, IState} from "./types";
import {LearningGoal} from "../../../../models/app/LearningGoal";
import {generateUniqueID} from "./helpers";
import { editState } from "../../../../models/app/Tile";

export default class LearningGoalsManager extends Component<IProps, IState> {

  addNewGoal = () => {
    const { tile, goals } = this.props;

    this.props.setGoals([
      { id: generateUniqueID(goals.map(g => g.id)),
        state: editState.new,
        tile_id: tile ? tile.id : -1,
        title: "",
        requirements: []
      },
      ...this.props.goals
    ]);
  }

  updateGoal = (goal: LearningGoal) => {
    if ((goal.state !== editState.new) && (goal.state !== editState.removed)) {
      goal.state = editState.updated;
    }
    this.props.setGoals(this.props.goals);
  }

  render(): React.ReactNode {
    const { tile, goals } = this.props;

    return (
      <div id={"learningGoalsManager"}>
        <h2>Construct learning goals.</h2>
        <Button shape={"round"}
                icon={<PlusOutlined />}
                onClick={this.addNewGoal}
        >
          Goal
        </Button>
        <Divider />

        { goals.map(goal => {
          return (
            <GoalEntry tile={tile}
                       goal={goal}
                       updateGoal={this.updateGoal}
            />
          )
        })}
      </div>
    );
  }
}