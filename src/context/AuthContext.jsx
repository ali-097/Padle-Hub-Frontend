import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, getUserFromToken } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenData = getUserFromToken(token);
      if (tokenData) {
        const userData = {
          id: tokenData.id,
          role: tokenData.role,
          email: localStorage.getItem("userEmail") || "user@example.com",
        };
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", credentials.email);

      const tokenData = getUserFromToken(token);
      const userData = {
        id: tokenData.id,
        role: tokenData.role,
        email: credentials.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      const loginResult = await login({
        email: userData.email,
        password: userData.password,
      });

      return loginResult;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
