import React, { useState } from "react";

import { FaSearch } from "react-icons/fa";
import "../App.css";

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
      fetch("/api/listings/")
        .then((response) => response.json())
        .then((json) => {
          const results = json.filter((listing) => {
            return (
              value && 
              listing && 
              listing.title &&
              listing.title.toLowerCase().includes(value)
            );
          });
          setResults(results);
        });
    };

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }
    
    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input 
              placeholder="Search listings..."
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}