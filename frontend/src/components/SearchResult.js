import React from 'react';
import "../App.css";

export const SearchResult = ({ result, searchByTitle }) => {
  return (
    <div 
      className="search-result"
      onClick={(e) => alert(`You clicked on ${result.title} - ${result.location}`)}
    >
      <div className="title">{result.title}</div>
      <div className="location">{result.location}</div>
    </div>
  );
};
