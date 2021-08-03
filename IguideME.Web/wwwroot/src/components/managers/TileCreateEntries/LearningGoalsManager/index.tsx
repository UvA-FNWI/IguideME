import React, { Component } from "react";
import {Button, Divider} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import GoalEntry from "./GoalEntry";
import {IProps, IState} from "./types";
import {LearningGoal} from "../../../../models/app/LearningGoal";
import {generateUniqueID} from "./helpers";

export default class LearningGoalsManager extends Component<IProps, IState> {

  addNewGoal = () => {
    const { tile, goals } = this.props;

    this.props.setGoals([
      { id: generateUniqueID(goals.map(g => g.id)),
        tile_id: tile ? tile.id : -1,
        title: "",
        requirements: []
      },
      ...this.props.goals
    ]);
  }

  updateGoal = (goal: LearningGoal) => {
    let goals: LearningGoal[] = JSON.parse(JSON.stringify(this.props.goals));
    const idx = goals.findIndex(g => g.id === goal.id)!;

    goals[idx] = goal;
    this.props.setGoals(goals);
  }

  removeGoal = (id: number) => {
    this.props.setGoals(this.props.goals.filter((g: LearningGoal) => g.id !== id));
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
                       removeGoal={this.removeGoal}
            />
          )
        })}
      </div>
    );
  }
}