import React, { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import axios from "axios";

const Navbar: React.FC = () => {
  const data = useLoaderData<{
    user: {
      data: {
        created_at: string;
        email: string;
        email_verified_at: string | null;
        google_id: string | null;
        id: number;
        image: string;
        name: string;
        role: string;
        super: string;
        updated_at: string;
      }[];
      message: string;
      success: boolean;
    };
  }>();

  const [user, setUser] = useState(data.user.data[0]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for managing mobile menu

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/dashboard">
              <img
                src="/path-to-logo.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Dashboard
              </Link>
              <Link
                to="/song-requests"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Sol·licituds de Cançons
              </Link>
              <span className="text-gray-600 dark:text-gray-400">
                Rol actual del Usuari: {user.role === "dj" ? "DJ" : "Usuari"}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* User Settings Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <img
              src={user.image}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />
            <div className="relative">
              <button
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition"
                disabled={loading}
              >
                <span>{user.name}</span>
                <svg
                  className="ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md">
                <Link
                  to="/profile/edit"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  Profile
                </Link>

                {user.super === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => axios.post("/logout", {}, { withCredentials: true })}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 space-y-2 mt-4">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Dashboard
            </Link>
            <Link
              to="/song-requests"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Sol·licituds de Cançons
            </Link>
            <span className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              Rol actual del Usuari: {user.role === "dj" ? "DJ" : "Usuari"}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
