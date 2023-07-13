import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminPanel from "@/components/crystals/admin-panel/admin-panel.tsx"
import Home from "@/components/pages/home/home.tsx"

import ErrorPage from "@/components/pages/error"
import Tiles from "@/components/pages/admin/tiles/tiles.tsx"
import Layout from "@/components/pages/admin/layout/layout.tsx"
import StudentOverview from "@/components/pages/admin/studentoverview/studentoverview.tsx"
import GradePredictor from "@/components/pages/admin/predictor/predictor.tsx"
import GradeAnalyzer from "@/components/pages/admin/analyzer/analyzer.tsx"
import DataWizard from "@/components/pages/admin/datawizard/datawizard.tsx"
import Analytics from "@/components/pages/admin/analytics/analytics.tsx"
import NotificationCentre from "@/components/pages/admin/notificationcentre/notificationcentre.tsx"
import Settings from "@/components/pages/admin/settings/settings.tsx"
import Dashboard from "@/components/pages/admin/dashboard/dashboard.tsx"
import StudentDashboard from "@/components/pages/student-dashboard/student-dashboard.tsx"

import setup from "@/api/setup.tsx"

import './base.scss'

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5*60*1000,
    },
  },
});

// Sets up the backend.
setup.then();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} errorElement={<ErrorPage />}>
            <Route path="" element={<Home />} />
            <Route path=":id" element={<StudentDashboard />} />
            <Route path="admin" element={<AdminPanel />} >
              <Route path="" element={<Dashboard />} />
              <Route path="tiles" element={<Tiles />} />
              <Route path="layout" element={<Layout />} />
              <Route path="student-overview" element={<StudentOverview />} />
              <Route path="grade-predictor" element={<GradePredictor />} />
              <Route path="grade-analyzer" element={<GradeAnalyzer />} />
              <Route path="data-wizard" element={<DataWizard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notification-centre" element={<NotificationCentre />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
