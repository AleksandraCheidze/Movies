import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex items-center">
      <img src="search.svg" alt="search" className="absolute left-3 w-5 h-5" />
      <input
        type="text"
        placeholder="Search through thousands of movies"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 outline-none border border-gray-700 hover:border-purple-500 transition-colors"
      />
    </div>
  );
};

export default Search;
