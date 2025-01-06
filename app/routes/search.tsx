import React from "react";
import SearchComponent from "../components/SearchComponent";

export default function SearchPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Cerca DJs</h1>
      <SearchComponent />
    </div>
  );
}
