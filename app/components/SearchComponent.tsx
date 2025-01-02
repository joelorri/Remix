import React, { useState } from 'react';
import { searchProfiles, selectDj } from '../auth.client';
import ProfileList from './ProfileList';

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = await searchProfiles(query);
      if (data.success) {
        setResults(data.data);
        setError('');
      } else {
        setError('No s\'han trobat resultats.');
      }
    } catch (err) {
      setError('Error en fer la cerca. Torna-ho a intentar més tard.');
    }
  };

  const handleSelectDj = (profile: any) => {
    selectDj(profile);
    alert('DJ seleccionat i dades guardades a la cookie!');
    window.location.href = '/formdj';
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-lg rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Buscar per nom o email"
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ease-in-out duration-200"
            >
              Cercar
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="p-6">
          <ProfileList profiles={results} onSelect={handleSelectDj} />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
