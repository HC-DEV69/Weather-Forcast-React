import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeather,
  selectSelectedCity,
  selectUnit,
  selectWeather,
} from "../redux/weatherSlice";
import { describeWeather } from "../utils/weatherCodes";
import { formatTemp } from "../utils/temperature";
import { formatDay } from "../utils/date";

function ForecastPanel() {
  const dispatch = useDispatch();
  const city = useSelector(selectSelectedCity);
  const unit = useSelector(selectUnit);
  const weather = useSelector((state) => (city ? selectWeather(state, city.id) : undefined));

  if (!city) {
    return (
      <div className="card">
        <div className="card-body text-center text-body-secondary py-5">
          Search for a city above to see its forecast.
        </div>
      </div>
    );
  }

  const data = weather?.data;

  if (!data) {
    if (weather?.status === "failed") {
      return (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{weather.error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(fetchWeather(city))}
          >
            Retry
          </button>
        </div>
      );
    }
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading forecast</span>
          </div>
        </div>
      </div>
    );
  }

  const now = describeWeather(data.current.weatherCode);

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h2 className="h5 mb-0">{city.name}</h2>
        <small className="text-body-secondary">
          {[city.admin1, city.country].filter(Boolean).join(", ")}
        </small>
      </div>

      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <span className="weather-emoji-lg">{now.icon}</span>
          <div>
            <div className="display-4 fw-semibold lh-1">
              {formatTemp(data.current.temperature, unit)}
            </div>
            <div className="text-body-secondary">{now.label}</div>
          </div>
        </div>

        <div className="row text-center g-2">
          <div className="col-4">
            <div className="small text-body-secondary">Feels like</div>
            <div className="fw-semibold">{formatTemp(data.current.feelsLike, unit)}</div>
          </div>
          <div className="col-4">
            <div className="small text-body-secondary">Humidity</div>
            <div className="fw-semibold">{data.current.humidity}%</div>
          </div>
          <div className="col-4">
            <div className="small text-body-secondary">Wind</div>
            <div className="fw-semibold">{Math.round(data.current.windSpeed)} km/h</div>
          </div>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        {data.daily.map((day, index) => {
          const { label, icon } = describeWeather(day.weatherCode);
          return (
            <li key={day.date} className="list-group-item d-flex align-items-center">
              <span className="fw-semibold" style={{ width: "6.5rem" }}>
                {formatDay(day.date, index)}
              </span>

              <span className="flex-grow-1">
                <span className="me-2">{icon}</span>
                <span className="text-body-secondary d-none d-sm-inline">{label}</span>
              </span>

              <span className="text-info small me-3">💧 {day.rainChance ?? "–"}%</span>

              <span className="fw-semibold">{formatTemp(day.max, unit)}</span>
              <span className="text-body-secondary ms-2">{formatTemp(day.min, unit)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ForecastPanel;
