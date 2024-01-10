// /----------------------------- React ------------------------------/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// /--------------------------- Components ---------------------------/
import ErrorPage from "@/components/pages/error";
import Home from "@/components/pages/home/home.tsx";
import Tiles from "@/components/pages/admin/tiles/tiles.tsx";
import EditLayout from "@/components/pages/admin/layout/layout.tsx";
import Settings from "@/components/pages/admin/settings/settings.tsx";
import Dashboard from "@/components/pages/admin/dashboard/dashboard.tsx";
import Analytics from "@/components/pages/admin/analytics/analytics.tsx";
import GradeAnalyzer from "@/components/pages/admin/analyzer/analyzer.tsx";
import AdminPanel from "@/components/crystals/admin-panel/admin-panel.tsx";
import DataWizard from "@/components/pages/admin/datawizard/datawizard.tsx";
import LearningGoals from "@/components/pages/admin/learning-goals/learning-goals.tsx";
import GradePredictor from "@/components/pages/admin/predictor/predictor.tsx";
import StudentDashboard from "@/components/pages/student-dashboard/student-dashboard.tsx";
import StudentOverview from "@/components/pages/admin/studentoverview/studentoverview.tsx";
import NotificationCentre from "@/components/pages/admin/notificationcentre/notificationcentre.tsx";

// /----------------------------- Misc. ------------------------------/
import App from "./App.tsx";
import setup from "@/api/setup.tsx";

// Loads the base style sheet for the app.
import "./base.scss";

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Sets up the backend (registers the course if the course hasn't been registered yet).
await setup;

// Routing for the frontend. This is separate from the routing on the backend.
// Routes that end with /> are endpoints but routes that have other routes listed before </Route>
// will have those routes render within an Outlet component.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} errorElement={<ErrorPage />}>
            <Route path="" element={<Home />} />
            <Route path=":id" element={<StudentDashboard />} />
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
              <Route
                path="notification-centre"
                element={<NotificationCentre />}
              />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
