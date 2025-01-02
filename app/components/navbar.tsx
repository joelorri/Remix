import { Link, Form } from "@remix-run/react";
import { useState } from "react";

export default function Navbar({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-md">
      {/* Primary Navigation Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/dashboard">
              <img
                src="/path-to-logo.png" // Actualitza amb el camí del teu logo
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-8">
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
                {/* Rol actual del Usuari: {user.role} */}
              </span>
            </div>
          </div>

          {/* User Settings Dropdown */}
          <div className="hidden sm:flex items-center space-x-4">
            <img
              // src={`/storage/${user.image}`} // Ruta de la imatge de perfil
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition"
              >
                {/* <span>{user.name}</span> */}
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

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md">
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Profile
                  </Link>
                  <Form method="post" action="/profile/toggle-role">
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      {/* {user.role === "dj" ? "Canviar a Usuari" : "Canviar a DJ"} */}
                    </button>
                  </Form>
                  {/* {user.super === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === "dj" && (
                    <Link
                      to="/dj/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      DJ Dashboard
                    </Link>
                  )} */}
                  <Form method="post" action="/logout">
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      Log Out
                    </button>
                  </Form>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu (for mobile) */}
          <div className="-me-2 flex items-center sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  className={open ? "hidden" : "inline-flex"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={open ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Navigation Menu */}
      {open && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Dashboard
            </Link>
            <Link
              to="/song-requests"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Sol·licituds de Cançons
            </Link>
          </div>
          <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
            <div className="px-4">
              <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                {/* {user.name} */}
              </div>
              {/* <div className="font-medium text-sm text-gray-500">{user.email}</div> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
