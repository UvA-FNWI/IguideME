import React, { Component } from "react";
import { Statistic } from "antd";
import { WarningOutlined, LikeOutlined } from "@ant-design/icons";
import "./style.scss";

export default class GradeStatistic extends Component<
  { grade: string },
  { loading: boolean }
> {
  state = { loading: true };

  componentDidMount(): void {
    this.setup();
  }

  setup = () => {
    this.setState({ loading: false });
  };

  renderIcon = (grade: number): React.ReactNode => {
    if (grade <= 0) {
      return <></>;
    }
    if (grade >= 5.5) {
      return <LikeOutlined className={"pass"} />;
    }

    return <WarningOutlined className={"fail"} />;
  };

  render(): React.ReactNode {
    const { loading } = this.state;
    const { grade } = this.props;

    const prefix = this.renderIcon(parseFloat(grade));

    return (
      <div className={"gradeStatistic"}>
        <Statistic
          title={"Grade"}
          value={grade}
          loading={loading}
          prefix={prefix}
          suffix={""}
        />
      </div>
    );
  }
}
