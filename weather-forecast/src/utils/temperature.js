export function toDisplay(celsius, unit) {
  return unit === "F" ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatTemp(celsius, unit) {
  return `${Math.round(toDisplay(celsius, unit))}°${unit}`;
}
