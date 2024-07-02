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
} from '@ant-design/icons';

export const getAdminPanelMenuItems = (courseId: string) => [
  { label: 'Dashboard', key: '1', icon: <DatabaseOutlined />, route: `/${courseId}/admin/admin-panel` },
  { label: 'Tiles', key: '2', icon: <AppstoreOutlined />, route: `/${courseId}/admin/admin-panel/tiles` },
  { label: 'Layout', key: '3', icon: <LaptopOutlined />, route: `/${courseId}/admin/admin-panel/layout` },
  {
    label: 'Student Overview',
    key: '4',
    icon: <TeamOutlined />,
    route: `/${courseId}/admin/admin-panel/student-overview`,
  },
  {
    label: 'Grade Predictor',
    key: '5',
    icon: <FundProjectionScreenOutlined />,
    route: `/${courseId}/admin/admin-panel/grade-predictor`,
  },
  {
    label: 'Grade Analyzer',
    key: '6',
    icon: <DotChartOutlined />,
    route: `/${courseId}/admin/admin-panel/grade-analyzer`,
  },
  {
    label: 'Learning Goals',
    key: '7',
    icon: <TrophyOutlined />,
    route: `/${courseId}/admin/admin-panel/learning-goals`,
  },
  {
    label: 'Data Wizard',
    key: '8',
    icon: <CloudUploadOutlined />,
    route: `/${courseId}/admin/admin-panel/data-wizard`,
  },
  { label: 'Usage Analytics', key: '9', icon: <ClusterOutlined />, route: `/${courseId}/admin/admin-panel/analytics` },
  {
    label: 'Notification Centre',
    key: '10',
    icon: <NotificationOutlined />,
    route: `/${courseId}/admin/admin-panel/notification-centre`,
  },
  { label: 'Settings', key: '11', icon: <ControlOutlined />, route: `/${courseId}/admin/admin-panel/settings` },
];
