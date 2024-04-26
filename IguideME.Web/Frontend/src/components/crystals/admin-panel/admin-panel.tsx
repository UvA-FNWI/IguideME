import {
  AppstoreOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  ControlOutlined,
  DatabaseOutlined,
  DotChartOutlined,
  FundProjectionScreenOutlined,
  LaptopOutlined,
  NotificationOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getSelf } from '@/api/users';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, type FC, type ReactElement } from 'react';

export const adminPanelMenuItems = [
  { label: 'Dashboard', key: '1', icon: <DatabaseOutlined />, route: '/admin' },
  { label: 'Tiles', key: '2', icon: <AppstoreOutlined />, route: '/admin/tiles' },
  { label: 'Layout', key: '3', icon: <LaptopOutlined />, route: '/admin/layout' },
  { label: 'Student Overview', key: '4', icon: <TeamOutlined />, route: '/admin/student-overview' },
  { label: 'Grade Predictor', key: '5', icon: <FundProjectionScreenOutlined />, route: '/admin/grade-predictor' },
  { label: 'Grade Analyzer', key: '6', icon: <DotChartOutlined />, route: '/admin/grade-analyzer' },
  { label: 'Learning Goals', key: '7', icon: <TrophyOutlined />, route: '/admin/learning-goals' },
  { label: 'Data Wizard', key: '8', icon: <CloudUploadOutlined />, route: '/admin/data-wizard' },
  { label: 'Usage Analytics', key: '9', icon: <ClusterOutlined />, route: '/admin/analytics' },
  { label: 'Notification Centre', key: '10', icon: <NotificationOutlined />, route: '/admin/notification-centre' },
  { label: 'Settings', key: '11', icon: <ControlOutlined />, route: '/admin/settings' },
];

const routeToKeyMap: { [key: string]: string } = adminPanelMenuItems.reduce(
  (map, item) => ({ ...map, [item.route]: item.key }),
  {},
);
const getKeyFromLocation = (location: string): string => routeToKeyMap[location] || '1';

const AdminPanel: FC = (): ReactElement => {
  // This data is already fetched in the App component.
  // Meaning that it is readily available for use in the AdminPanel component.
  const { data: self } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const items = useMemo(
    () =>
      adminPanelMenuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: <Link to={item.route}>{item.label}</Link>,
      })),
    [],
  );

  return (
    <Layout>
      <Layout.Sider
        breakpoint='lg'
        trigger={null}
        collapsedWidth='80px'
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className='max-md:!hidden !bg-white'
      >
        <div className='flex content-center flex-col justify-center bg-white p-4 border-b border-solid border-b-gray-200 h-header'>
          {collapsed ?
            <h3 className='text-center'>
              <UserOutlined />
            </h3>
          : <>
              <h3 className='text-lg'>{self?.name}</h3>
              <strong>
                <UserOutlined /> Instructor
              </strong>
            </>
          }
        </div>
        <Menu defaultSelectedKeys={[getKeyFromLocation(location.pathname)]} mode='inline' items={items} />
      </Layout.Sider>
      <Layout.Content className='p-5 relative bg-slate-50 min-h-[calc(100dvh-70px)]'>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AdminPanel;
