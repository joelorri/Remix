import React from 'react';
import SearchComponent from '../components/SearchComponent';

const Home: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center my-6">Buscador de Perfiles</h2>
      <SearchComponent />
    </div>
  );
};

export default Home;
