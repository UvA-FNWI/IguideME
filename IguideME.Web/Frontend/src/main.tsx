// /----------------------------- React ------------------------------/
import App from './App.tsx';
import LoadingPage from './components/pages/loading.tsx';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import setup from '@/api/setup.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './globals.css';

// /--------------------------- Pages ---------------------------/
const ErrorPage = lazy(async () => await import('@/components/pages/error.tsx'));
const Home = lazy(async () => await import('@/components/pages/home/home.tsx'));
const Tiles = lazy(async () => await import('@/components/pages/admin/tiles/tiles.tsx'));
const EditLayout = lazy(async () => await import('@/components/pages/admin/layout/layout.tsx'));
const Settings = lazy(async () => await import('@/components/pages/admin/settings/settings.tsx'));
const Dashboard = lazy(async () => await import('@/components/pages/admin/dashboard/dashboard.tsx'));
const Analytics = lazy(async () => await import('@/components/pages/admin/analytics/analytics.tsx'));
const GradeAnalyzer = lazy(async () => await import('@/components/pages/admin/analyzer/analyzer.tsx'));
const AdminPanel = lazy(async () => await import('@/components/crystals/admin-panel/admin-panel.tsx'));
const DataWizard = lazy(async () => await import('@/components/pages/admin/datawizard/datawizard.tsx'));
const LearningGoals = lazy(async () => await import('@/components/pages/admin/learning-goals/learning-goals.tsx'));
const GradePredictor = lazy(async () => await import('@/components/pages/admin/predictor/predictor.tsx'));
const StudentDashboard = lazy(async () => await import('@/components/pages/student-dashboard/student-dashboard.tsx'));
const StudentOverview = lazy(async () => await import('@/components/pages/admin/studentoverview/studentoverview.tsx'));
const NotificationCentre = lazy(
  async () => await import('@/components/pages/admin/notificationcentre/notificationcentre.tsx'),
);
const ViewLayout = lazy(async () => await import('@/components/crystals/layout-view/layout-view.tsx'));
const TileDetailView = lazy(async () => await import('@/components/pages/tile-detail-view/tile-detail-view.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

async function enableMocking(): Promise<ServiceWorkerRegistration | undefined> {
  if (import.meta.env.MODE !== 'mock') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return await worker.start();
}

enableMocking()
  .then(async () => {
    // Sets up the backend (registers the course if the course hasn't been registered yet).
    return await setup();
  })
  .then(
    () => {
      // Routing for the frontend. This is separate from the routing on the backend.
      // Routes that end with /> are endpoints but routes that have other routes listed before </Route>
      // will have those routes render within an Outlet component.
      ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
                    <Route path="" element={<Home />} />
                    <Route path=":id" element={<StudentDashboard />}>
                      <Route path="" element={<ViewLayout />} />
                      <Route path=":tid" element={<TileDetailView />} />
                    </Route>
                    <Route path="admin" element={<AdminPanel />}>
                      <Route path="" element={<Dashboard />} />
                      <Route path="tiles" element={<Tiles />} />
                      <Route path="layout" element={<EditLayout />} />
                      <Route path="student-overview" element={<StudentOverview />} />
                      <Route path="grade-predictor" element={<GradePredictor />} />
                      <Route path="grade-analyzer" element={<GradeAnalyzer />} />
                      <Route path="data-wizard" element={<DataWizard />} />
                      <Route path="learning-goals" element={<LearningGoals />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="notification-centre" element={<NotificationCentre />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            {import.meta.env.MODE === 'mock' && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </React.StrictMode>,
      );
    },
    () => {
      console.error('Setup unsuccesful');
    },
  );
