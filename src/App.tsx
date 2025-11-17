import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhTW from "antd/locale/zh_TW";
import { useEffect } from "react";

import { firebaseDataProvider } from "./providers/dataProvider";
import { firebaseAuthProvider } from "./providers/authProvider";
import WorkoutLayout from "./components/WorkoutLayout";
import WorkoutDashboard from "./components/WorkoutDashboard";
import WorkoutCalendar from "./components/WorkoutCalendar";
import WorkoutList from "./components/WorkoutList";
import { CreateWorkoutPlan } from "./pages/workout";
import LoginPage from "./pages/LoginPage";
import { APP_VERSION, BUILD_TIMESTAMP } from "./config/version";

function App() {
  // Use different basename for development and production
  const basename = import.meta.env.DEV ? '/' : '/workout';

  // Display version info in console
  useEffect(() => {
    console.log(`%c🏋️ Workout Calendar v${APP_VERSION}`, 'color: #0ea5e9; font-size: 16px; font-weight: bold;');
    console.log(`%cBuild Time: ${BUILD_TIMESTAMP}`, 'color: #6b7280; font-size: 12px;');
    console.log(`%c✨ Tailwind CSS UI Redesign`, 'color: #22c55e; font-size: 14px;');
  }, []);
  
  return (
    <ConfigProvider locale={zhTW}>
      <BrowserRouter basename={basename}>
        <Refine
          dataProvider={firebaseDataProvider}
          authProvider={firebaseAuthProvider}
          resources={[
            {
              name: "workouts",
              list: "/workouts",
              create: "/workouts/create",
              edit: "/workouts/edit/:id",
              show: "/workouts/show/:id",
            },
            {
              name: "settings",
              list: "/settings",
              create: "/settings/create",
              edit: "/settings/edit/:id",
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            {/* Main authenticated routes */}
            <Route
              path="/*"
              element={
                <Authenticated
                  key="authenticated-routes"
                  fallback={<LoginPage />}
                >
                  <WorkoutLayout />
                </Authenticated>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<WorkoutDashboard />} />
              <Route path="calendar" element={<WorkoutCalendar />} />
              <Route path="create-plan" element={<CreateWorkoutPlan mode="create" />} />
              <Route path="edit/:id" element={<CreateWorkoutPlan mode="edit" />} />
              <Route path="list" element={<WorkoutList />} />
              {/* Legacy routes for backward compatibility */}
              <Route path="workouts" element={<Navigate to="/list" replace />} />
            </Route>
            
            {/* Login route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Refine>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;