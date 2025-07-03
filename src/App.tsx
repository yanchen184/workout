import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ConfigProvider, Tag } from "antd";
import zhTW from "antd/locale/zh_TW";

import { firebaseDataProvider } from "./providers/dataProvider";
import { firebaseAuthProvider } from "./providers/authProvider";
import WorkoutPage from "./pages/WorkoutPage";
import LoginPage from "./pages/LoginPage";

// Version display component
const VersionDisplay = () => {
  const version = "1.8.1"; // Updated version
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      color: '#666'
    }}>
      <Tag color="blue">v{version}</Tag>
    </div>
  );
};

function App() {
  return (
    <ConfigProvider locale={zhTW}>
      <BrowserRouter>
        <VersionDisplay />
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
            {/* Redirect workout-calendar paths to root */}
            <Route path="/workout-calendar" element={<Navigate to="/" replace />} />
            <Route path="/workout-calendar/*" element={<Navigate to="/" replace />} />
            
            {/* Main authenticated routes */}
            <Route
              element={
                <Authenticated
                  key="authenticated-routes"
                  fallback={<LoginPage />}
                >
                  <Outlet />
                </Authenticated>
              }
            >
              <Route index element={<WorkoutPage />} />
              <Route path="/" element={<WorkoutPage />} />
              <Route path="/workouts" element={<WorkoutPage />} />
            </Route>
            
            {/* Login route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Refine>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;