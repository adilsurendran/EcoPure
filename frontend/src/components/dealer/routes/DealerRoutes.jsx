import { Routes, Route } from "react-router-dom";
import DealerLayout from "../layout/DealerLayout";
import DealerDashboard from "../DealerDashboard";
import DealerProfile from "../DealerProfile";
import WasteRequest from "../WasteRequest";
import RequestStatus from "../RequestStatus";
import Notifications from "../Notifications";
import DealerWasteMarket from "../DealerWasteMarket";
import DealerRequests from "../DealerRequests";
import DealerDirectRequest from "../DealerDirectRequest";



export default function DealerRoutes() {
  return (
    <DealerLayout>
      <Routes>
        <Route path="/" element={<DealerDashboard />} />
        <Route path="/profile" element={<DealerProfile />} />
        <Route path="/request" element={<DealerDirectRequest />} />
        <Route path="/status" element={<RequestStatus />} />
        <Route path="/posts" element={<DealerWasteMarket />} />
        <Route path="/requests" element={<DealerRequests />} />
      </Routes>
    </DealerLayout>
  );
}
