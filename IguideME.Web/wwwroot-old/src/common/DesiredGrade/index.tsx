import React, { Component } from "react";
import "./style.scss";
import { Radio, Space } from "antd";
import AppController from "../../api/controllers/app";

interface IProps {};
interface IState {
  goalGrade: number

};

class DesiredGrade extends Component<IProps, IState> {

  state = {
    goalGrade: -1,
  }

  componentDidMount(): void {
    AppController.getGoalGrade().then(goalGrade =>
      this.setState({ goalGrade: goalGrade }));
  }

  handleGradeChange = (grade: number ): void => {
    AppController.trackAction(`Set grade to ${grade}`);
    AppController.setGoalGrade(grade).then(() => this.setState({ goalGrade: grade }))
  }

  render(): React.ReactNode {

    return (
      <div id={"desiredGrade"}>
        <h1>Goal Grade</h1>
        <p>Please indicate the grade you wish to obtain for this course. You can always change your goal at a later stage!</p>

        <Space direction={"vertical"}>
          <Radio.Group
            value={this.state.goalGrade}
            onChange={val => this.handleGradeChange(val.target.value)}
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
              { label: '6', value: 6 },
              { label: '7', value: 7 },
              { label: '8', value: 8 },
              { label: '9', value: 9 },
              { label: '10', value: 10 }
            ]}
            optionType="button"
          />
        </Space>
      </div>
    )
  }
}

export default DesiredGrade;