import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">PaddleHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your ultimate destination for booking and managing padel courts.
            Find the perfect court, book your game, and enjoy the sport you
            love.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/courts"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg inline-block"
            >
              Browse Courts
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose PaddleHub?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make it easy to find and book the perfect padel court for your
            game
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Find Courts Near You
            </h3>
            <p className="text-gray-600">
              Discover padel courts in your area with our easy-to-use location
              finder
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Easy Booking
            </h3>
            <p className="text-gray-600">
              Book your preferred time slot with just a few clicks
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quality Assured
            </h3>
            <p className="text-gray-600">
              All courts are verified for quality and maintained to high
              standards
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of players who trust PaddleHub for their court
            bookings
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg inline-block"
            >
              Start Playing Today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
