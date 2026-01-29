import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Validate session on app load / refresh
const fetchMe = async () => {
  try {
    const res = await API.get("/auth/me");
    setUser(res.data.user);
  } catch (err) {
    if (err.response?.status === 401) {
      // wait for interceptor to retry
      setUser(null);
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
