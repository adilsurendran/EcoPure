import {
  Truck,
  CheckCircle,
  MapPin,
  TrendingUp,
  Activity,
  User,
  Navigation
} from "lucide-react";
import "../admin/styles/AdminTable.css";

export default function WorkerDashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="admin-page-container">
      {/* HEADER / GREETING */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="header-content">
          <h1>{greeting}, Worker</h1>
          <p>Welcome to your operational headquarters. Here's your impact at a glance.</p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">System Status</span>
            <span className="stat-value">Operational</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Navigation size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Current Route</span>
            <span className="stat-value">Primary Zone A</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <MapPin size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Assigned Zone</span>
            <span className="stat-value">Urban Sector 4</span>
          </div>
        </div>
      </div>

      {/* WELCOME / CALL TO ACTION */}
      <div className="table-card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, white, #f8fafc)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary-light)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--primary-green)'
          }}>
            <Truck size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--deep-green)', marginBottom: '1rem' }}>Ready for Collection?</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your daily pickup missions are synchronized and ready for execution.
            Head over to the Assigned Pickups tab to launch your navigation and start your sustainable journey.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <div className="stat-card" style={{ flex: '0 1 200px', padding: '1rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }} />
              <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Eco-Impact</span>
              <span style={{ fontWeight: 700 }}>Top 10%</span>
            </div>
            <div className="stat-card" style={{ flex: '0 1 200px', padding: '1rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }} />
              <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Reliability</span>
              <span style={{ fontWeight: 700 }}>98.5% Index</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
