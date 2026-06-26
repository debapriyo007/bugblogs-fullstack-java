/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { api } from "@/services/api";

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = React.useState(() =>
    localStorage.getItem("user") ? "session-active" : null,
  );
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = React.useState(true);

  const logout = React.useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Failed to logout on server:", err);
    } finally {
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const res = await api.get("/api/users/me");
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          setToken("session-active");
        } catch (err) {
          console.error("Failed to load user profile on startup:", err);
          await logout();
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();

    const handleAuthChanged = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, [logout]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const loggedInUser = res.data;

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setToken("session-active");
    } catch (err) {
      await logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });
      const loggedInUser = res.data;

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setToken("session-active");
    } catch (err) {
      await logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    await api.post("/api/auth/register", { username, email, password });
  };

  const fetchOAuthUser = async (oAuthToken) => {
    setLoading(true);
    try {
      const headers = oAuthToken
        ? { headers: { Authorization: `Bearer ${oAuthToken}` } }
        : {};
      const res = await api.get("/api/users/me", headers);
      const loggedInUser = res.data;
      if (oAuthToken) {
        loggedInUser.token = oAuthToken;
      }
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setToken("session-active");
      return loggedInUser;
    } catch (err) {
      await logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileState = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        updateProfileState,
        fetchOAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
