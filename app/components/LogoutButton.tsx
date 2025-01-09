import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true); // Start loading state
      const response = await axios.post(
        "http://localhost/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials like cookies
        }
      );

      console.log("Logout response:", response.data);

      // Clear authentication cookies
      document.cookie = "authToken=; Max-Age=0; Path=/;";

      // Redirect to login page
      navigate("/login");
    } catch (error: unknown) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
