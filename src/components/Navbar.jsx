import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-800">PaddleHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
            {(!isAuthenticated || user?.role !== "admin") && (
              <Link
                to="/courts"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Courts
              </Link>
            )}
            {isAuthenticated && (
              <>
                {user?.role !== "admin" && (
                  <Link
                    to="/bookings"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    My Bookings
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-gray-600">
                    Welcome,{" "}
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </p>
                  {user?.role && (
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
