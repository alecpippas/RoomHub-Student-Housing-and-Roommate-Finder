import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export const SearchResult = ({ result }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listings/${result.created_at}`);
  };

  return (
    <div className="search-result" onClick={handleClick}>
      <div className="title">{result.title}</div>
      <div className="location">{result.location}</div>
    </div>
  );
};
