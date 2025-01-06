import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import DjInfo from "../components/DjInfo";
import SearchForm, { Track as SearchFormTrack } from "../components/SearchForm";
import TrackList from "../components/TrackList";
import Navbar from "~/components/navbar";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuthToken } from "~/auth.server";
import { json } from 'react-router-dom';
export const loader: LoaderFunction = async ({ request }) => {
  await getAuthToken(request);
  const res = await fetch(`http://localhost/api/user`, {
    credentials: 'include',
    headers: {
      Cookie: request.headers.get('Cookie') || '',
    },
  });

  if (res.status !== 200) {
    return redirect('/login'); 
    
  }

  const user = await res.json();
  if (!user) {
    return redirect('/login');
  }

  return json({ user });
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
     }>();
     const user = data.user.data[0];
  
  const [tracks, setTracks] = useState<SearchFormTrack[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<{ [id: string]: string }>({});
  const [comments, setComments] = useState<{ [id: string]: string }>({});
  const [selectedDj, setSelectedDj] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Funció per obtenir el valor d'una cookie pel nom
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
        setError("Error en llegir les dades del DJ seleccionat.");
        console.error("Error en analitzar la cookie de DJ:", e);
      }
    } else {
      setError("No s'ha seleccionat cap DJ. Redirigint a la pàgina de cerca...");
      setTimeout(() => navigate("/home"), 3000);
    }
  }, [navigate]);

  const handleSubmit = () => {
    if (!selectedDj || !Object.keys(selectedTracks).length) {
      setError("Si us plau, selecciona com a mínim una cançó.");
      return;
    }

    const trackIds = Object.keys(selectedTracks);
    const payload = {
      dj_id: selectedDj.id,
      songs: trackIds.map((_, index) => index + 1),
      comments: trackIds.reduce((acc, trackId) => {
        acc[trackId] = comments[trackId] || "";
        return acc;
      }, {}),
      tracks: trackIds.reduce((acc, trackId) => {
        const track = tracks.find((t) => t.id === trackId);
        if (track) {
          acc[trackId] = track.name;
          acc[`${trackId}_artist`] = track.artist;
        }
        return acc;
      }, {}),
    };

    localStorage.setItem("formPayload", JSON.stringify(payload));
    navigate("/submit-form-route");
  };

  return (
    <>
    <Navbar />  
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold text-center mb-4">Formulari de Cerca DJ</h2>
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
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Continuar
      </button>
    </div>
    </>
  );
};

export default FormDj;
