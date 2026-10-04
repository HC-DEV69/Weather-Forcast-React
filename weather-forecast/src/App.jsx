import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllWeather, selectCities } from "./redux/weatherSlice";
import SearchBar from "./components/SearchBar";
import CityCard from "./components/CityCard";
import ForecastPanel from "./components/ForecastPanel";
import UnitToggle from "./components/UnitToggle";

function App() {
  const dispatch = useDispatch();
  const cities = useSelector(selectCities);

  useEffect(() => {
    dispatch(fetchAllWeather());
  }, [dispatch]);

  return (
    <div className="bg-body text-body min-vh-100">
      <nav className="navbar border-bottom mb-4">
        <div className="container d-flex flex-wrap gap-2">
          <span className="navbar-brand mb-0 h1">🌤️ Weather Forecast</span>

          <div className="d-flex gap-2">
            <UnitToggle />
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => dispatch(fetchAllWeather())}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="container pb-5">
        <div className="mb-4">
          <SearchBar />
        </div>

        <div className="row g-4">
          <div className="col-lg-7 order-1 order-lg-2">
            <div className="sticky-lg-top" style={{ top: "1rem" }}>
              <ForecastPanel />
            </div>
          </div>

          <div className="col-lg-5 order-2 order-lg-1">
            {cities.length === 0 ? (
              <div className="alert alert-secondary">
                No saved cities yet. Search for one above to add it.
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 g-3">
                {cities.map((city) => (
                  <div className="col" key={city.id}>
                    <CityCard city={city} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
