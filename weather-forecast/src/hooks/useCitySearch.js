import { useEffect, useState } from "react";
import { searchCities } from "../api/openMeteo";
import useDebounce from "./useDebounce";

function useCitySearch(query) {
  const debounced = useDebounce(query.trim(), 400);
  const enabled = debounced.length >= 2; 

  const [result, setResult] = useState({ query: "", cities: [], error: null });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    searchCities(debounced, controller.signal)
      .then((cities) => setResult({ query: debounced, cities, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return; 
        setResult({ query: debounced, cities: [], error: err.message });
      });

    return () => controller.abort();
  }, [debounced, enabled]);

  const isCurrent = enabled && result.query === debounced;

  return {
    results: isCurrent ? result.cities : [],
    loading: enabled && !isCurrent, 
    error: isCurrent ? result.error : null,
    searched: isCurrent,
  };
}

export default useCitySearch;
