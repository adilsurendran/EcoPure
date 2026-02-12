import { Routes, Route } from "react-router-dom";

import AdminLayout from "../AdminLayout";
import Dashboard from "../Dashboard";
import Users from "../Users";
import Workers from "../Workers";
import AssignWorkers from "../AssignWorkers";
import Dealers from "../Dealers";
import AdminWaste from "../AdminWaste";
import AdminWasteRequests from "../AdminWasteRequests";
import AdminDirectRequests from "../AdminDirectRequests";
import AdminUserFeedbacks from "../AdminUserFeedbacks";
import AdminComplaints from "../AdminComplaints";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/assign" element={<AssignWorkers />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/complaints" element={<AdminComplaints />} />
        <Route path="/feedback" element={<AdminUserFeedbacks />} />
        <Route path="/post" element={<AdminWaste />} />
        <Route path="/waste/request" element={<AdminWasteRequests />} />
        <Route path="/waste/dealer/request" element={<AdminDirectRequests />} />
      </Routes>
    </AdminLayout>
  );
}
