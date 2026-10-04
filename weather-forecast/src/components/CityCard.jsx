import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeather,
  removeCity,
  selectCity,
  selectSelectedId,
  selectUnit,
  selectWeather,
} from "../redux/weatherSlice";
import { describeWeather } from "../utils/weatherCodes";
import { formatTemp } from "../utils/temperature";

function CityCard({ city }) {
  const dispatch = useDispatch();
  const unit = useSelector(selectUnit);
  const isSelected = useSelector((state) => selectSelectedId(state) === city.id);
  const weather = useSelector((state) => selectWeather(state, city.id));

  const data = weather?.data;
  const isLoading = !weather || weather.status === "loading";
  const failed = weather?.status === "failed";

  const place = [city.admin1, city.country].filter(Boolean).join(", ");
  const current = data ? describeWeather(data.current.weatherCode) : null;

  return (
    <div className={`card h-100 shadow-sm ${isSelected ? "border-primary" : ""}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-0">{city.name}</h5>
            <small className="text-body-secondary">{place}</small>
          </div>

          {isLoading && (
            <div className="spinner-border spinner-border-sm text-secondary" role="status">
              <span className="visually-hidden">Loading</span>
            </div>
          )}
        </div>

        {data && (
          <div className="d-flex align-items-center gap-3 mt-3">
            <span className="weather-emoji">{current.icon}</span>
            <div>
              <div className="fs-2 fw-semibold">
                {formatTemp(data.current.temperature, unit)}
              </div>
              <div className="text-body-secondary">{current.label}</div>
            </div>
          </div>
        )}

        {failed && !data && (
          <div className="alert alert-danger py-2 mt-3 mb-0 small">{weather.error}</div>
        )}

        {failed && data && (
          <small className="text-warning d-block mt-2">
            Could not refresh. Showing the last loaded data.
          </small>
        )}
      </div>

      <div className="card-footer d-flex gap-2">
        <button
          type="button"
          className={`btn btn-sm flex-grow-1 ${isSelected ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => dispatch(selectCity(city.id))}
        >
          {isSelected ? "Viewing" : "View forecast"}
        </button>

        {failed && (
          <button
            type="button"
            className="btn btn-sm btn-outline-warning"
            onClick={() => dispatch(fetchWeather(city))}
          >
            Retry
          </button>
        )}

        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label={`Remove ${city.name}`}
          onClick={() => dispatch(removeCity(city.id))}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CityCard;
