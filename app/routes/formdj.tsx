import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import DjInfo from "../components/DjInfo";
import SearchForm, { Track as SearchFormTrack } from "../components/SearchForm";
import TrackList from "../components/TrackList";
import Navbar from "~/components/navbar";
import { LoaderFunction, redirect, json } from '@remix-run/node';
import { getAuthToken } from "~/auth.server";

// Loader function to fetch user data
export const loader: LoaderFunction = async ({ request }) => {
  const authToken = await getAuthToken(request);

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
  if (!user) {
    return redirect("/login");
  }

  return json({ user, authToken });
};

const FormDj: React.FC = () => {
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
    authToken: string;
  }>();
console.log(data);
  const { authToken } = data;
  const [tracks, setTracks] = useState<SearchFormTrack[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<{ [id: string]: string }>({});
  const [comments, setComments] = useState<{ [id: string]: string }>({});
  interface Dj {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string;
    created_at: string;
  }

  const [selectedDj, setSelectedDj] = useState<Dj | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Function to get a cookie by name
  const getCookieValue = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  useEffect(() => {
    const djCookie = getCookieValue("selected_dj");
    if (djCookie) {
      try {
        const dj = JSON.parse(djCookie);
        setSelectedDj(dj);
      } catch (e) {
        setError("Error reading selected DJ data.");
        console.error("Error parsing DJ cookie:", e);
      }
    } else {
      setError("No DJ selected. Redirecting to the search page...");
      setTimeout(() => navigate("/home"), 3000);
    }
  }, [navigate]);

  const handleSubmit = async () => {
  if (!selectedDj || !Object.keys(selectedTracks).length) {
    setError("Please select at least one track.");
    return;
  }

  setIsSubmitting(true); // Set submitting state to true
  try {
    // Generate a new mapping for track IDs starting from 1
    const trackMapping = Object.keys(selectedTracks).reduce(
      (acc, trackId, index) => {
        acc[trackId] = index + 1; // Incremental numeric IDs
        return acc;
      },
      {} as { [key: string]: number }
    );

    const payload = {
      dj_id: selectedDj.id,
      songs: Object.values(trackMapping), 
      comments: Object.keys(trackMapping).reduce((acc, trackId) => {
        const newId = trackMapping[trackId];
        acc[newId] = comments[trackId] || ""; 
        return acc;
      }, {} as { [id: number]: string }),
      tracks: Object.keys(trackMapping).reduce((acc, trackId) => {
        const track = tracks.find((t) => t.id === trackId);
        const newId = trackMapping[trackId];
        if (track) {
          acc[newId] = track.name; 
          acc[`${newId}_artist`] =
            track.album?.artists?.[0]?.name || "";
        }
        return acc;
      }, {} as { [key: string]: string }),
    };

    console.log("payload:", payload);
    console.log("authToken:", authToken);

    const response = await fetch("http://localhost/api/requests/stored", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    navigate("/success");
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An error occurred.");
    }
    console.error("Error submitting request:", err);
  } finally {
    setIsSubmitting(false); // Reset submitting state
  }
};

  
  
  

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-semibold text-center mb-4">DJ Search Form</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {selectedDj && <DjInfo dj={selectedDj} />}
        <SearchForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTracks={setTracks}
          setError={setError}
        />
        {tracks.length > 0 && (
          <TrackList
            tracks={tracks}
            selectedTracks={selectedTracks}
            setSelectedTracks={setSelectedTracks}
            comments={comments}
            setComments={setComments}
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`mt-4 px-6 py-2 ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-md`}
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>
    </>
  );
};

export default FormDj;
