import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navbar from "~/components/navbar";

// Loader to fetch user information
export async function loader({ request }: { request: Request }) {
  const res = await fetch(`http://localhost/api/user`, {
    credentials: "include",
    headers: {
      Cookie: request.headers.get("Cookie") || "",
    },
  });

  if (res.status !== 200) {
    return redirect("/login");
  }

  const user = await res.json();
  if (!user || !user.data || user.data.length === 0) {
    return redirect("/login");
  }

  return json({ user });
}

export default function SongRequests() {
  const data = useLoaderData<{
    user: {
      data: {
        id: number;
        name: string;
        email: string;
        role: string;
        image: string;
        created_at: string;
        updated_at: string;
      }[];
    };
  }>();

  // Extract user data
  const [user] = useState(data.user?.data?.[0] || null);

  // State for song requests and loading
  const [songRequests, setSongRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to safely get cookie value
  const getCookieValue = (name: string): string => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
      return cookie?.split("=")[1] || "";
    }
    return "";
  };

  const token = getCookieValue("authToken");

  // Fetch song requests when the component mounts
  useEffect(() => {
    async function fetchSongRequests() {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      if (!token) {
        console.error("No auth token found");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost/api/requests/getRequest/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch song requests: ${errorData.message}`);
        }

        const data = await response.json();
        setSongRequests(data.data || []);
      } catch (error) {
        console.error("Error fetching song requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongRequests();
  }, [user, token]);

  return (
    <>
      <Navbar />
      <div>
        <h1>Song Requests</h1>
        {loading ? (
          <p>Loading...</p>
        ) : songRequests.length === 0 ? (
          <p>No song requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Comments</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {songRequests.map((request) => {
                let songDetails;
                try {
                  songDetails = JSON.parse(request.song_details || "{}");
                } catch (error) {
                  console.error("Invalid song details JSON:", error);
                  songDetails = {};
                }

                return (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{songDetails.title || "N/A"}</td>
                    <td>{songDetails.artist || "N/A"}</td>
                    <td>{request.comments || "No comments"}</td>
                    <td>{request.status || "Unknown"}</td>
                    <td>{new Date(request.created_at).toLocaleString()}</td>
                    <td>{new Date(request.updated_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
