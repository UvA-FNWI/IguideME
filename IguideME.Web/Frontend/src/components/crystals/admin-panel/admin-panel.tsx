import { getSelf } from "@/api/users";
import { type FC, type ReactElement, useState } from "react";
import { useQuery } from "react-query";
import {
  AppstoreOutlined,
  ControlOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  DotChartOutlined,
  FundProjectionScreenOutlined,
  LaptopOutlined,
  NotificationOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Layout, Menu, type MenuProps } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items: MenuItem[] = [
  getItem(<Link to={"/admin"}> Dashboard </Link>, "1", <DatabaseOutlined />),
  getItem(<Link to={"/admin/tiles"}> Tiles </Link>, "2", <AppstoreOutlined />),
  getItem(<Link to={"/admin/layout"}> Layout </Link>, "3", <LaptopOutlined />),
  getItem(
    <Link to={"/admin/student-overview"}> Student Overview </Link>,
    "4",
    <TeamOutlined />,
  ),
  getItem(
    <Link to={"/admin/grade-predictor"}> Grade Predictor </Link>,
    "5",
    <FundProjectionScreenOutlined />,
  ),
  getItem(
    <Link to={"/admin/grade-analyzer"}> Grade Analyzer </Link>,
    "6",
    <DotChartOutlined />,
  ),
  getItem(
    <Link to={"/admin/learning-goals"}> Learning Goals </Link>,
    "7",
    <TrophyOutlined />,
  ),
  getItem(
    <Link to={"/admin/data-wizard"}> Data Wizard </Link>,
    "8",
    <CloudUploadOutlined />,
  ),
  getItem(
    <Link to={"/admin/analytics"}> Usage Analytics </Link>,
    "9",
    <ClusterOutlined />,
  ),
  getItem(
    <Link to={"/admin/notification-centre"}> Notification Centre </Link>,
    "10",
    <NotificationOutlined />,
  ),
  getItem(
    <Link to={"/admin/settings"}> Settings </Link>,
    "11",
    <ControlOutlined />,
  ),
];

const AdminPanel: FC = (): ReactElement => {
  const { isLoading, data: self } = useQuery("self", getSelf);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "white",
        },
      }}
    >
      <Layout className='min-h-[90dvh]'>
        <Sider
          breakpoint="lg"
          trigger={null}
          collapsedWidth="80px"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => {
            setCollapsed(value);
          }}
          className="bg-white"
        >
          <div className='flex content-center flex-col justify-center font-maitree p-4 border-b border-solid border-b-gray-200 h-header'>
            {!collapsed ? (
              <>
                <div>
                  <h3>{!isLoading ? self?.name : "Loading profile..."}</h3>
                  <strong>
                    <UserOutlined /> Instructor
                  </strong>
                </div>
              </>
            ) : (
              <h3>
                <UserOutlined />
              </h3>
            )}
          </div>
          <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </Sider>
        <Content
          className='relative bg-slate-50 p-5 font-maitree'
        >
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminPanel;
