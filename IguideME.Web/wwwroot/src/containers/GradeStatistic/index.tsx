import React, { Component } from "react";
import {Statistic} from "antd";
import { WarningOutlined, LikeOutlined } from "@ant-design/icons";
import "./style.scss";

export default class GradeStatistic extends Component<
  { grade: string },
  { loading: boolean, passed: boolean }
  > {

  state = { loading: true, passed: false }

  componentDidMount(): void {
    this.setup();
  }

  setup = () => {
    const { grade } = this.props;

    this.setState({ loading: false, passed: parseFloat(grade) >= 5.5 });
  }

  render(): React.ReactNode {
    const { loading, passed } = this.state;
    const { grade } = this.props;

    return (
      <div className={"gradeStatistic"}>
        <Statistic title={"Grade"}
                   value={grade}
                   loading={loading}
                   prefix={passed ?
                     <LikeOutlined className={"pass"} /> :
                     <WarningOutlined  className={"fail"} />
                   }
        />
      </div>
    );
  }
}