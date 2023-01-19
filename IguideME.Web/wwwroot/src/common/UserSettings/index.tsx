import React, { Component } from "react";
import { Button, Col, Row, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BellTwoTone } from "@ant-design/icons";
import DesiredGrade from "../DesiredGrade";
import Consent from "../Consent";


interface IProps {settings: (view: boolean) => void};
interface IState {
    notifications: boolean;
    updatingNotifications: boolean;
};

export default class UserSettings extends Component<IProps, IState> {

    state = {
        notifications: true,
        updatingNotifications: false
    }

    toggleNotifications = () => {
        this.setState({notifications: !this.state.notifications});
    };

    render(): React.ReactNode {
        const { settings } = this.props;
        let { notifications, updatingNotifications } = this.state;

        return (
            <div>
            <Row>
            <Col span={6}>
                <div style={{padding: 20}}>
                    <Button type={"ghost"}
                        icon={<ArrowLeftOutlined />}
                        onClick={() => settings(false)}
                    >
                    Return to dashboard
                    </Button>
                </div>
            </Col>
            <Col span={4} offset={14}>
                <div style={{padding: 20, textAlign: 'center'}}>
                <Tooltip key={`tooltip`}
                         title={<span>Notifications are turned <strong>{ notifications ? "on" : "off"}</strong>.</span>}>
                  <Button type={"ghost"}
                          key={`toggleNotifications`}
                          loading={updatingNotifications}
                          size={'large'}
                          shape="circle"
                          icon={<BellTwoTone twoToneColor={notifications ? "rgb(0, 185, 120)" : "rgb(255, 110, 90)"} />}
                          onClick={() => this.toggleNotifications()}
                  />
                </Tooltip>
                </div>
            </Col>
            </Row>
            <Row>
            <Col span={24}>
                <DesiredGrade/>
            </Col>
            </Row>
            <Row>
            <Col span={24}>
                <Consent/>
            </Col>
            </Row>
            </div>
        )
    }
}

