import React, { Component } from "react";
import { withConsent } from "../../hoc/withConsent";
import { withAdminRole } from "../../hoc/withAdminRole";
import { UserDataProps } from "../../hoc/types";
import "./style.scss";
import {Button, Radio, Space} from "antd";

class DesiredGrade extends Component<UserDataProps> {

  render(): React.ReactNode {
    return (
      <div id={"desiredGrade"}>
        <h1>Grade</h1>
        <p>Please indicate the grade you wish to obtain for this course. You can always change your goal at a later stage!</p>

        <Space direction={"vertical"}>
          <Radio.Group
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' },
              { label: '8', value: '8' },
              { label: '9', value: '9' },
              { label: '10', value: '10' }
            ]}
            optionType="button"
          />

          <Button type={"primary"}>
            Submit
          </Button>
        </Space>
      </div>
    )
  }
}

export default withConsent(withAdminRole(DesiredGrade));