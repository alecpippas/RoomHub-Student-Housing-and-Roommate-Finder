import { useState } from "react";
import {
  Button,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { SearchBar } from "../components/SearchBar";
import { SearchResultsList } from "../components/SearchResultsList";
import housebg from "../static/housebg.png";

function HomeScreen() {

  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/listings?search=${encodeURIComponent(searchValue)}`);
  }

  return (
    <div
      style={{
        backgroundImage: "url(" + housebg + ")",
        border: "5px solid black",
        backgroundPosition: "center",
        position: "relative",
        height: "100vh",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="HomeScreen">
        <div className="search-bar-container">
          <SearchBar setResults={setResults} onInputChange={setSearchValue} />
          <SearchResultsList results={results} />
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </div> 
  );
}

export default HomeScreen;
