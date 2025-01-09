import React, { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import LogoutButton from "./LogoutButton";
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


  const [role, setRole] = useState(data.user.data[0].super);
  const [loading, setLoading] = useState(false);

  const toggleRole = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost/api/profile/toggle-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
        },
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setRole((prevRole) => (prevRole === "dj" ? "client" : "dj"));
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [user] = useState(data.user.data[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/home">
              <img
                src="/path-to-logo.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/home"
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
              <button
                onClick={toggleRole}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-md ${
                  role === "dj" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Processing..." : `Switch to ${role === "dj" ? "Client" : "DJ"} Role`}
              </button>
              <span className="text-gray-600 dark:text-gray-400">
                Rol actual del Usuari: {user.role === "dj" ? "DJ" : "Usuari"}
              </span>
            </div>
          </div>

          {/* Right-Side Options */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/profileedit"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Profile
            </Link>

            {user.super === "admin" && (
              <Link
                to="/adminhome"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Admin Dashboard
              </Link>
            )}
            

            <LogoutButton />
            <img
              src={user.image}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />
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
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 space-y-2 mt-4">
            <Link
              to="/home"
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
            <Link
              to="/profileedit"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Profile
            </Link>
            {user.super === "admin" && (
              <Link
                to="/adminhome"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="block px-4 py-2">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
