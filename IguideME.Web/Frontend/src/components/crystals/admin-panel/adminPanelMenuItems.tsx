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
