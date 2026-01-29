import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import UserDashboard from "../UserDashboard";
import PickupRequest from "../PickupRequest";
import PickupStatus from "../PickupStatus";
import Feedback from "../Feedback";
import Complaints from "../Complaints";
import UserProfile from "../UserProfile";
import UserFeedback from "../UserFeedback";



export default function UserRoutes() {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/request" element={<PickupRequest />} />
        <Route path="/status" element={<PickupStatus />} />
        <Route path="/feedback" element={<UserFeedback />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </UserLayout>
  );
}
