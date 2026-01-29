import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protect/ProtectedRoute";

import { lazy, Suspense } from "react";

const Login = lazy(() => import("./components/Login"));
const UserRegister = lazy(() => import("./components/user/UserRegister"));
const DealerRegister = lazy(() => import("./components/dealer/DealerRegister"));
const WorkerRegister = lazy(() => import("./components/worker/WorkerRegister"));

const AdminRoutes = lazy(() =>
  import("./components/admin/routes/AdminRoutes")
);
const UserRoutes = lazy(() =>
  import("./components/user/routes/UserRoutes")
);
const DealerRoutes = lazy(() =>
  import("./components/dealer/routes/DealerRoutes")
);
const WorkerRoutes = lazy(() =>
  import("./components/worker/routes/WorkerRoutes")
);



function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/register/dealer" element={<DealerRegister />} />
        <Route path="/register/worker" element={<WorkerRegister />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dealer/*"
          element={
            <ProtectedRoute allowedRoles={["dealer"]}>
              <DealerRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/*"
          element={
            <ProtectedRoute allowedRoles={["worker"]}>
              <WorkerRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}


export default App;
