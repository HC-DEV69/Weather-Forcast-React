import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getForecast } from "../api/openMeteo";

export const STORAGE_KEY = "weather-app:v1";

const DEFAULT_CITIES = [
  { id: 1275339, name: "Mumbai", admin1: "Maharashtra", country: "India", latitude: 19.07283, longitude: 72.88261 },
  { id: 2643743, name: "London", admin1: "England", country: "United Kingdom", latitude: 51.50853, longitude: -0.12574 },
  { id: 5128581, name: "New York", admin1: "New York", country: "United States", latitude: 40.71427, longitude: -74.00597 },
  { id: 1850147, name: "Tokyo", admin1: "Tokyo", country: "Japan", latitude: 35.6895, longitude: 139.69171 },
];

function loadInitialState() {
  const base = {
    cities: DEFAULT_CITIES,
    selectedId: DEFAULT_CITIES[0].id,
    unit: "C",
    weatherById: {}, 
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.cities)) {
      const stillExists = saved.cities.some((c) => c.id === saved.selectedId);
      return {
        ...base,
        cities: saved.cities,
        selectedId: stillExists ? saved.selectedId : saved.cities[0]?.id ?? null,
        unit: saved.unit === "F" ? "F" : "C",
      };
    }
  } catch {
  }
  return base;
}


export const fetchWeather = createAsyncThunk("weather/fetchWeather", (city) =>
  getForecast(city.latitude, city.longitude)
);


export const fetchAllWeather = () => (dispatch, getState) => {
  getState().weather.cities.forEach((city) => dispatch(fetchWeather(city)));
};

const isSaved = (state, id) => state.cities.some((c) => c.id === id);

const weatherSlice = createSlice({
  name: "weather",
  initialState: loadInitialState(),

  reducers: {
    addCity(state, action) {
      const city = action.payload;
      if (!isSaved(state, city.id)) state.cities.push(city); 
      state.selectedId = city.id;
    },
    removeCity(state, action) {
      const id = action.payload;
      state.cities = state.cities.filter((c) => c.id !== id);
      delete state.weatherById[id];
      if (state.selectedId === id) {
        state.selectedId = state.cities[0]?.id ?? null;
      }
    },
    selectCity(state, action) {
      state.selectedId = action.payload;
    },
    setUnit(state, action) {
      state.unit = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state, action) => {
        const id = action.meta.arg.id;
        if (!isSaved(state, id)) return;
        const previous = state.weatherById[id];
        state.weatherById[id] = {
          data: previous?.data ?? null, 
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        if (!isSaved(state, id)) return;
        state.weatherById[id] = {
          data: action.payload,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        const id = action.meta.arg.id;
        if (!isSaved(state, id)) return;
        const previous = state.weatherById[id];
        state.weatherById[id] = {
          data: previous?.data ?? null,
          status: "failed",
          error: action.error.message,
        };
      });
  },
});

export const selectCities = (state) => state.weather.cities;
export const selectUnit = (state) => state.weather.unit;
export const selectSelectedId = (state) => state.weather.selectedId;
export const selectSelectedCity = (state) =>
  state.weather.cities.find((c) => c.id === state.weather.selectedId) ?? null;
export const selectWeather = (state, cityId) => state.weather.weatherById[cityId];

export const { addCity, removeCity, selectCity, setUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
