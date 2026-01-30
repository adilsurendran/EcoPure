import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import "./styles/Login.css";

function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ username, password });
      setUser(res.data.user); // 🔑 SINGLE SOURCE OF TRUTH
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🚦 Navigate ONLY when auth state is ready
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "worker") navigate("/worker");
    else if (user.role === "dealer") navigate("/dealer");
    else navigate("/user");
  }, [user, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <h1>EcoPure</h1>
          <p>
            Smart Waste Management <br />
            for a Cleaner Tomorrow
          </p>
        </div>

        <div className="login-right">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>

          {error && (
            <div className="error-box">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p>New here?</p>
            <Link to="/register/user">Register as User</Link>
            <span> | </span>
            <Link to="/register/dealer">
              Register as Dealer
            </Link>
          </div>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
