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
} from '@ant-design/Icons';
import type { SideNavigationLinkProps } from './RootLayout';

export const getAdminPanelMenuItems = (courseId: string, path: string): SideNavigationLinkProps[] => [
  {
    label: 'Dashboard',
    Icon: DatabaseOutlined,
    to: `/${courseId}/admin/admin-panel`,
    activeOverride: path === `/${courseId}/admin/admin-panel`,
  },
  { label: 'Tiles', Icon: AppstoreOutlined, to: `/${courseId}/admin/admin-panel/tiles` },
  { label: 'Layout', Icon: LaptopOutlined, to: `/${courseId}/admin/admin-panel/layout` },
  {
    label: 'Student Overview',
    Icon: TeamOutlined,
    to: `/${courseId}/admin/admin-panel/student-overview`,
  },
  {
    label: 'Grade Predictor',
    Icon: FundProjectionScreenOutlined,
    to: `/${courseId}/admin/admin-panel/grade-predictor`,
  },
  {
    label: 'Grade Analyzer',
    Icon: DotChartOutlined,
    to: `/${courseId}/admin/admin-panel/grade-analyzer`,
  },
  {
    label: 'Learning Goals',
    Icon: TrophyOutlined,
    to: `/${courseId}/admin/admin-panel/learning-goals`,
  },
  {
    label: 'Data Wizard',
    Icon: CloudUploadOutlined,
    to: `/${courseId}/admin/admin-panel/data-wizard`,
  },
  { label: 'Usage Analytics', Icon: ClusterOutlined, to: `/${courseId}/admin/admin-panel/analytics` },
  {
    label: 'Notification Centre',
    Icon: NotificationOutlined,
    to: `/${courseId}/admin/admin-panel/notification-centre`,
  },
  { label: 'Settings', Icon: ControlOutlined, to: `/${courseId}/admin/admin-panel/settings` },
];
