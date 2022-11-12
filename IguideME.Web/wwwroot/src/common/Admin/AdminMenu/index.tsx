import React, { Component } from "react";
import {
    AppstoreOutlined,
    ControlOutlined,
    CloudUploadOutlined,
    ClusterOutlined,
    DotChartOutlined,
    FundProjectionScreenOutlined,
    LaptopOutlined,
    TrophyOutlined,
    NotificationOutlined,
    DatabaseOutlined,
    UserOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import "./style.scss";
import { RootState } from "../../../store";
import { connect, ConnectedProps } from "react-redux";

const mapState = (state: RootState) => ({
    user: state.user
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { menuKey: string } & PropsFromRedux;

class AdminMenu extends Component<Props> {

    render(): React.ReactNode {
        const { user } = this.props;

        return (
            <div id={"adminMenu"}>
                <div id={"user"}>
                    <h3>{user ? user.name : "Loading profile..."}</h3>
                    <strong><UserOutlined /> Instructor</strong>
                </div>

                <Menu selectedKeys={[this.props.menuKey]}>
                    <Menu.Item key={"datamart"} icon={<DatabaseOutlined />}>
                        <Link to={'/admin'}>
                            Datamart
            </Link>
                    </Menu.Item>

                    <Menu.Item key={"tiles"} icon={<AppstoreOutlined />}>
                        <Link to={'/admin/tiles'}>
                            Tiles
            </Link>
                    </Menu.Item>

                    <Menu.Item key={"dashboard"} icon={<LaptopOutlined />}>
                        <Link to={'/admin/dashboard'}>
                            Dashboard
            </Link>
                    </Menu.Item>

                    <Menu.Item key={"studentOverview"} icon={<TeamOutlined />}>
                        <Link to={'/admin/student-overview'}>
                            Student Overview
            </Link>
                    </Menu.Item>
                    <Menu.SubMenu key={"submenu"} icon={<TrophyOutlined />} title={"Grades"}>
                        <Menu.Item key={"gradePredictorOld"} icon={<FundProjectionScreenOutlined />}>
                            <Link to={'/admin/grade-predictor-old'}>
                                Old Predictor
              </Link>
                        </Menu.Item>
                        <Menu.Item key={"gradePredictor"} icon={<FundProjectionScreenOutlined />}>
                            <Link to={'/admin/grade-predictor'}>
                                Predictor
              </Link>
                        </Menu.Item>
                        <Menu.Item key={"gradeAnalyzer"} icon={<DotChartOutlined />}>
                            <Link to={'/admin/grade-analyzer'}>
                                Analyzer
              </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key={"dataWizard"} icon={<CloudUploadOutlined />}>
                        <Link to={'/admin/data-wizard'}>
                            Data Wizard
            </Link>
                    </Menu.Item>
                    <Menu.Item key={"analytics"} icon={<ClusterOutlined />}>
                        <Link to={'/admin/analytics'}>
                            Analytics
            </Link>
                    </Menu.Item>
                    <Menu.Item key={"notificationCentre"} icon={<NotificationOutlined />}>
                        <Link to={'/admin/notification-centre'}>
                            Notification Centre
            </Link>
                    </Menu.Item>
                    <Menu.Item key={"settings"} icon={<ControlOutlined />}>
                        <Link to={'/admin/settings'}>
                            Settings
            </Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default connector(AdminMenu);
