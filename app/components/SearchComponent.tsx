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
    <div>
      <h2>Buscador de Perfiles</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre o email"
        />
        <button type="submit">Buscar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProfileList profiles={results} onSelect={handleSelectDj} />
    </div>
  );
};

export default SearchComponent;
