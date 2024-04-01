import { useState } from "react";
import "../App.css";

import { SearchBar } from "../components/SearchBar";
import { SearchResultsList } from "../components/SearchResultsList";

function HomeScreen() {

const [results, setResults] = useState([]);

  return (
    <div className="HomeScreen">
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
    </div>
  );
}

export default HomeScreen;
