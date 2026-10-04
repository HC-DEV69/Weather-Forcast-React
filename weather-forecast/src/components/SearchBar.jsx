import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCity, fetchWeather } from "../redux/weatherSlice";
import useCitySearch from "../hooks/useCitySearch";

function SearchBar() {
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");

  const { results, loading, error, searched } = useCitySearch(query);

  const handleSelect = (city) => {
    dispatch(addCity(city));
    dispatch(fetchWeather(city));
    setQuery("");
  };

  const showDropdown = query.trim().length >= 2;

  return (
    <div className="position-relative">
      <input
        type="search"
        className="form-control form-control-lg"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for a city"
      />

      {showDropdown && (
        <div
          className="list-group position-absolute w-100 shadow mt-1"
          style={{ zIndex: 1000 }}
        >
          {loading && (
            <div className="list-group-item text-body-secondary">Searching...</div>
          )}

          {error && <div className="list-group-item text-danger">{error}</div>}

          {searched && !error && results.length === 0 && (
            <div className="list-group-item text-body-secondary">
              No cities found. Check the spelling.
            </div>
          )}

          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(city)}
            >
              <strong>{city.name}</strong>
              <span className="text-body-secondary">
                {[city.admin1, city.country].filter(Boolean).map((p) => `, ${p}`).join("")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
