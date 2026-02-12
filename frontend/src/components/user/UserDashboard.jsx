import { useEffect, useState } from "react";
import { getUserStats } from "../../api/user.api";
import {
  Recycle,
  Clock,
  MessageSquareWarning,
  PlusCircle,
  ClipboardList,
  MessageSquareQuote,
  Megaphone,
  User,
  ArrowRight,
  PieChart,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/UserPremium.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPickups: 0,
    pendingComplaints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getUserStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load user dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    { title: "Cleanup Request", desc: "Book a new waste collection", icon: <PlusCircle size={24} />, path: "/request", color: "#059669" },
    { title: "Request Status", desc: "Track your active & past pickups", icon: <ClipboardList size={24} />, path: "/status", color: "#0ea5e9" },
    { title: "My Complaints", desc: "View replies to your concerns", icon: <MessageSquareQuote size={24} />, path: "/complaints", color: "#ef4444" },
    { title: "Send Complaint", desc: "Report issues or suggestions", icon: <MessageSquareWarning size={24} />, path: "/sendcomplaints", color: "#f59e0b" },
    { title: "Share Feedback", desc: "Help us improve our service", icon: <Megaphone size={24} />, path: "/feedback", color: "#8b5cf6" },
    { title: "My Profile", desc: "Manage your account details", icon: <User size={24} />, path: "/profile", color: "#64748b" },
  ];

  if (loading) return (
    <div className="user-premium-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="user-premium-container">
      {/* HEADER */}
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>Welcome Back!</h1>
          <p>Monitor your waste management impact and activities.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#dcfce7', color: '#16a34a', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          Your account is secured
        </div>
      </div>

      {/* STATS GRID */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Recycle size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Waste Requests</h3>
            <p>{stats.totalPickups}</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>Pending Pickups</h3>
            <p>{stats.pendingPickups}</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#f59e0b' }}>
            <MessageSquareWarning size={28} />
          </div>
          <div className="stat-info">
            <h3>Active Complaints</h3>
            <p>{stats.pendingComplaints}</p>
          </div>
        </div>
      </div>

      {/* QUICK LINKS GRID */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PieChart size={20} color="var(--user-primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--user-text-main)', margin: 0 }}>Activity Shortcuts</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>
        {navCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid var(--user-border)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = 'var(--user-border)';
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `${card.color}15`,
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--user-text-main)' }}>{card.title}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--user-text-muted)', lineHeight: 1.4 }}>{card.desc}</p>
            </div>
            <ArrowRight size={18} color="#cbd5e1" />
          </div>
        ))}
      </div>
    </div>
  );
}
