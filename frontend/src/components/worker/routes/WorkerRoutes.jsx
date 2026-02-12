import { Routes, Route } from "react-router-dom";
import WorkerLayout from "../layout/WorkerLayout";
import WorkerDashboard from "../WorkerDashboard";
import AssignedPickups from "../AssignedPickups";
import PickupHistory from "../PickupHistory";



export default function WorkerRoutes() {
  return (
    <WorkerLayout>
      <Routes>
        {/* <Route path="/" element={<WorkerDashboard />} /> */}
        <Route path="/assigned" element={<AssignedPickups />} />
        <Route path="/history" element={<PickupHistory />} />
      </Routes>
    </WorkerLayout>
  );
}
