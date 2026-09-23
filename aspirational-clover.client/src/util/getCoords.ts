import { Polyline, Coord } from "../data/shapes";

export function getCoords(polyline: Polyline): Coord[] {
  const values: Record<string, Coord[]> = {}; // memo
  try {
    const data = polyline?.coords;
    if (typeof data === "string" && data.length > 0 && data in values) {
      return values[data];
    }
    const { coords } = JSON.parse(data) as { coords: Coord[] };
    values[data] = coords;
    return coords;
  } catch (e) {
    console.log(`error parsing coords, `, e);
    return [];
  }
}
