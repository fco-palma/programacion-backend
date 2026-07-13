import type { SeasonKey } from "../app/data/shopData";

export function getSeason(): SeasonKey {
  const month = new Date().getMonth() + 1;

  // Estaciones de Chile y el hemisferio sur.
  if (month >= 9 && month <= 11) return "spring";
  if (month === 12 || month <= 2) return "summer";
  if (month >= 3 && month <= 5) return "autumn";
  return "winter";
}
