import React, { useState, useEffect } from 'react';
import { redirect, useNavigate, json } from 'react-router-dom';
import { getSelectedDj,submitRequest} from '../auth.client';
import DjInfo from '../components/DjInfo';
import SearchForm, { Track as SearchFormTrack } from '../components/SearchForm';
import TrackList from '../components/TrackList';
import { ShowErrors } from 'types/interfaces';


const FormDj: React.FC = () => {
  const [tracks, setTracks] = useState<SearchFormTrack[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<{ [id: string]: string }>({});
  const [comments, setComments] = useState<{ [id: string]: string }>({});
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  interface Dj {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string;
    created_at: string;
  }

  const [selectedDj, setSelectedDj] = useState<Dj | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dj = getSelectedDj();
    if (dj) {
      setSelectedDj(dj);
    } else {
      setError('No s\'ha seleccionat cap DJ. Redirigint a la pàgina de cerca...');
      setTimeout(() => navigate('/search'), 3000);
    }
  }, [navigate]);

  const handleSubmitRequest = async () => {
    if (!selectedDj || !Object.keys(selectedTracks).length) {
      setError('Si us plau, selecciona com a mínim una cançó.');
      return;
    }

    try {
      const trackIds = Object.keys(selectedTracks);
      const songs = trackIds.map((_, index) => index + 1);

      const commentsMapped: Record<number, string> = trackIds.reduce((acc: Record<number, string>, trackId, index) => {
        acc[songs[index]] = comments[trackId] || '';
        return acc;
      }, {});

      const tracksMapped: { [key: string]: string } = trackIds.reduce((acc: { [key: string]: string }, trackId, index) => {
        const track = tracks.find(t => t.id === trackId);
        if (track) {
          acc[songs[index]] = track.name;
          acc[`${songs[index]}_artist`] = track.album.artists[0]?.name || '';
        }
        return acc;
      }, {});

      const payload = {
        dj_id: selectedDj.id,
        songs,
        comments: commentsMapped,
        tracks: tracksMapped,
      };
      console.log('payload', payload);
    try {
        await submitRequest(payload);
        return redirect('/search');
    } catch (error) {
        console.error('error', error);
        return json({ error: (error as ShowErrors).title }, { status: 401 });
    }
    } catch (err) {
      setError('Hi ha hagut un error en enviar les peticions.');
    }
  };

  return (
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
        onClick={handleSubmitRequest}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Enviar Petició
      </button>
    </div>
  );
};

export default FormDj;
