import WorkerSidebar from "./WorkerSidebar";
import "../../styles/worker.css";

export default function WorkerLayout({ children }) {
  return (
    <div className="worker-container">
      <WorkerSidebar />
      <div className="worker-main">
        <div className="worker-content">{children}</div>
      </div>
    </div>
  );
}
