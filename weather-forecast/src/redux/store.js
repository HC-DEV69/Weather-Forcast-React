import { configureStore } from "@reduxjs/toolkit";
import weatherReducer, { STORAGE_KEY } from "./weatherSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer, 
  },
});

store.subscribe(() => {
  const { cities, selectedId, unit } = store.getState().weather;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cities, selectedId, unit }));
  } catch {
    
  }
});
