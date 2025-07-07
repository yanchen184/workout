import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhTW from "antd/locale/zh_TW";

import { firebaseDataProvider } from "./providers/dataProvider";
import { firebaseAuthProvider } from "./providers/authProvider";
import WorkoutLayout from "./components/WorkoutLayout";
import WorkoutDashboard from "./components/WorkoutDashboard";
import WorkoutCalendar from "./components/WorkoutCalendar";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <ConfigProvider locale={zhTW}>
      <BrowserRouter basename="/workout">
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
              <Route path="add" element={<WorkoutForm mode="create" />} />
              <Route path="edit/:id" element={<WorkoutForm mode="edit" />} />
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