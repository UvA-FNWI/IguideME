import Layout from '@/components/crystals/layout/RootLayout';
import ErrorPage from '@/components/pages/error';
import { AxiosError } from 'axios';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { Course, getCourseById } from './api/courses';
import { getStudent } from './api/users';
import CourseSelection from './components/pages/courses-selection/CourseSelection';
import NotFound from './components/pages/NotFound';
import { User } from './types/user';

export const createRouter = () =>
  createBrowserRouter(
    [
      {
        element: <Layout />,
        handle: {
          crumb: () => [
            {
              href: '/',
              label: 'Home',
            },
          ],
        },
        children: [
          {
            path: '/',
            element: <CourseSelection />,
            errorElement: <ErrorPage />,
          },
          {
            path: '/404-not-found',
            element: <NotFound />,
            handle: [
              {
                crumb: () => ({
                  href: '/404-not-found',
                  label: '404',
                }),
              },
            ],
          },
          {
            path: ':courseId',
            lazy: async () => {
              const Home = await import('@/components/pages/home/home.tsx');
              return { Component: Home.default };
            },
            loader: async ({ params }) => {
              try {
                if (!params['courseId']) return null;
                return await getCourseById(params['courseId']);
              } catch (error) {
                if ((error as AxiosError).response?.status === 404) throw redirect('/404-not-found');
                else throw error;
              }
            },
            handle: {
              crumb: (data: Course, params: { [key: string]: string }) => [
                {
                  href: `/${params['courseId']}`,
                  label: data ? data.name : 'Course',
                },
              ],
            },
          },
          {
            path: '/:courseId/:studentId',
            lazy: async () => {
              const StudentDashboard = await import('@/components/pages/student-dashboard/student-dashboard.tsx');
              return { Component: StudentDashboard.default };
            },
            children: [
              {
                index: true,
                lazy: async () => {
                  const ViewLayout = await import('@/components/crystals/layout-view/layout-view.tsx');
                  return { Component: ViewLayout.default };
                },
              },
              {
                path: ':tid',
                lazy: async () => {
                  const TileDetailView = await import('@/components/pages/tile-detail-view/tile-detail-view.tsx');
                  return { Component: TileDetailView.default };
                },
              },
            ],
            loader: async ({ params }) => {
              if (!params['courseId'] || !params['studentId']) throw redirect('/');

              try {
                const course = await getCourseById(params['courseId']);
                const user = await getStudent(params['studentId']);
                return { course, user };
              } catch (error) {
                if ((error as AxiosError).response?.status === 404) throw redirect('/404-not-found');
                else throw error;
              }
            },
            handle: {
              crumb: (data: { course: Course; user: User }, params: { [key: string]: string }) => [
                {
                  href: `/${params['courseId']}`,
                  label: data ? data.course.name : 'Course',
                },
                {
                  href: `/${params['courseId']}/${params['studentId']}`,
                  label: data ? `${data.user.name.split(' ')[0]}'s Dashboard` : `Student's Dashboard`,
                },
              ],
            },
          },
          {
            path: ':courseId/:studentId/settings',
            lazy: async () => {
              const StudentSettings = await import('@/components/pages/student-settings/student-settings.tsx');
              return { Component: StudentSettings.default };
            },
            loader: async ({ params }) => {
              if (!params['courseId'] || !params['studentId']) throw redirect('/');

              try {
                const course = await getCourseById(params['courseId']);
                const user = await getStudent(params['studentId']);
                return { course, user };
              } catch (error) {
                if ((error as AxiosError).response?.status === 404) throw redirect('/404-not-found');
                else throw error;
              }
            },
            handle: {
              crumb: (data: { course: Course; user: User }, params: { [key: string]: string }) => [
                {
                  href: `/${params['courseId']}`,
                  label: data ? data.course.name : 'Course',
                },
                {
                  href: `/${params['courseId']}/${params['studentId']}`,
                  label: data ? `${data.user.name.split(' ')[0]}'s Dashboard` : `Student's Dashboard`,
                },
                {
                  href: `/${params['courseId']}/${params['studentId']}/settings`,
                  label: 'Settings',
                },
              ],
            },
          },
          {
            path: ':courseId/admin',
            lazy: async () => {
              const AdminPanel = await import('@/components/crystals/admin-panel/admin-panel.tsx');
              return { Component: AdminPanel.default };
            },
            loader: async ({ params }) => {
              try {
                if (!params['courseId']) return null;
                return await getCourseById(params['courseId']);
              } catch (error) {
                if ((error as AxiosError).response?.status === 404) throw redirect('/404-not-found');
                else throw error;
              }
            },
            handle: (data: Course, params: { [key: string]: string }) => [
              {
                href: `/${params['courseId']}`,
                label: data ? data.name : 'Course',
              },
              {
                href: `/${params['courseId']}/admin`,
                label: 'Admin Panel',
              },
            ],
            children: [
              {
                index: true,
                lazy: async () => {
                  const Dashboard = await import('@/components/pages/admin/dashboard/dashboard.tsx');
                  return { Component: Dashboard.default };
                },
              },
              {
                path: 'tiles',
                lazy: async () => {
                  const Tiles = await import('@/components/pages/admin/tiles/tiles.tsx');
                  return { Component: Tiles.default };
                },
              },
              {
                path: 'layout',
                lazy: async () => {
                  const EditLayout = await import('@/components/pages/admin/layout/layout.tsx');
                  return { Component: EditLayout.default };
                },
              },
              {
                path: 'student-overview',
                lazy: async () => {
                  const StudentOverview = await import('@/components/pages/admin/studentoverview/studentoverview.tsx');
                  return { Component: StudentOverview.default };
                },
              },
              {
                path: 'grade-predictor',
                lazy: async () => {
                  const GradePredictor = await import('@/components/pages/admin/predictor/predictor.tsx');
                  return { Component: GradePredictor.default };
                },
              },
              {
                path: 'grade-analyzer',
                lazy: async () => {
                  const GradeAnalyzer = await import('@/components/pages/admin/analyzer/analyzer.tsx');
                  return { Component: GradeAnalyzer.default };
                },
              },
              {
                path: 'data-wizard',
                lazy: async () => {
                  const DataWizard = await import('@/components/pages/admin/datawizard/datawizard.tsx');
                  return { Component: DataWizard.default };
                },
              },
              {
                path: 'learning-goals',
                lazy: async () => {
                  const LearningGoals = await import('@/components/pages/admin/learning-goals/learning-goals.tsx');
                  return { Component: LearningGoals.default };
                },
              },
              {
                path: 'analytics',
                lazy: async () => {
                  const Analytics = await import('@/components/pages/admin/analytics/analytics.tsx');
                  return { Component: Analytics.default };
                },
              },
              {
                path: 'notification-centre',
                lazy: async () => {
                  const NotificationCentre = await import(
                    '@/components/pages/admin/notificationcentre/notificationcentre.tsx'
                  );
                  return { Component: NotificationCentre.default };
                },
              },
              {
                path: 'settings',
                lazy: async () => {
                  const AdminSettings = await import('@/components/pages/admin/settings/settings.tsx');
                  return { Component: AdminSettings.default };
                },
              },
            ],
          },
        ],
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
        v7_partialHydration: false,
      },
    },
  );
