// components/SearchForm.tsx

import React from 'react';
import axios from 'axios';

interface SearchFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ isLoading, setIsLoading, setTracks, setError }) => {
  const [query, setQuery] = React.useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError('Si us plau, introdueix una cerca.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get('http://localhost/api/spotify/search', {
        params: { query },
        withCredentials: true,
      });

      if (response.status === 200) {
        setTracks(response.data.data.tracks || []);
        setError('');
      } else {
        setError('No s\'han trobat resultats per la cerca.');
      }
    } catch (err) {
      setError('Hi ha hagut un error al realitzar la cerca.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="mb-6 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Escriu el nom de la cançó o artista..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isLoading ? 'Cercant...' : 'Cercar'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
