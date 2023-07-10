import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import StudentDashboard from "@/components/pages/student-dashboard"
import AdminDashboard from "@/components/pages/admin-dashboard"
import ErrorPage from "@/components/pages/error"
import Home from "@/components/pages/home/home.tsx"

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
            <Route path="admin" element={<AdminDashboard />} >
              {/* <Route path="analytics" element={<Analytics />} />
              <Route path="layout" element={<Layout />} />
              <Route path="notification-centre" element={<NotificationCentre />} />
              <Route path="student-overview" element={<StudentOverview />} />
              <Route path="data-wizard" element={<DataWizard />} />
              <Route path="grade-analyzer" element={<GradeAnalyzer />} />
              <Route path="grade-predictor" element={<GradePredictor />} />
              <Route path="settings" element={<Settings />} />
            <Route path="tiles" element={<Tiles />} /> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
