import React, { Component } from "react";
import { Button, Col, Row, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BellTwoTone } from "@ant-design/icons";
import DesiredGrade from "../DesiredGrade";
import Consent from "../Consent";
import ConsentController from "../../api/controllers/consent";
import Swal from "sweetalert2";
import AppController from "../../api/controllers/app";
import AdminController from "../../api/controllers/admin";


interface IProps {
    settings: (view: boolean) => void;
    consent?: string | null;
};

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
        this.setState({updatingNotifications: true});
        AppController.setNotificationEnable(!this.state.notifications)
            .then(enable => this.setState({notifications: enable, updatingNotifications: false}));
    };

    checkLeave(): void {
        AdminController.isAdmin().then((isadmin) => {
            if (isadmin) {
                this.leave()
                return;
            }
            ConsentController.fetchConsent().then((consent) => {
                if (consent !== 1) {
                    Swal.fire(
                        'No consent given',
                        'Please fill in the consent form!',
                        'error'
                        );
                    return;
                }

                AppController.getGoalGrade().then((grade) => {
                    if (grade === -1) {
                        Swal.fire(
                            'No goal grade selected',
                            'Please select a goal grade!',
                            'error'
                            );
                        return;
                    }
                    return this.leave();
                });
            })
        })
    }

    leave = (): void => {
        AppController.trackAction("Close settings");
        this.props.settings(false);
    }

    keyHandler(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.checkLeave();
        }
    }

    componentDidMount(): void {
        window.addEventListener("keydown", this.keyHandler.bind(this), false);
        AppController.trackAction("Open settings");
        AppController.getNotificationEnable()
            .then((enable) => this.setState({notifications: enable}));
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyHandler.bind(this), false);
    }

    render(): React.ReactNode {
        let { notifications, updatingNotifications } = this.state;

        return (
            <div>
            <Row justify={"space-between"} align={"middle"}>
                <Col >
                    <div style={{padding: 20}}>
                        <Button type={"ghost"}
                            icon={<ArrowLeftOutlined />}
                            onClick={() => this.checkLeave()}
                            shape="circle"
                        >
                        </Button>
                    </div>
                </Col>
                <Col >
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
            <Row justify={"center"}>
                <Col >
                    <DesiredGrade/>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col >
                    <Consent text={this.props.consent} handle_accept={() => this.checkLeave()}/>
                </Col>
            </Row>
            </div>
        )
    }
}

