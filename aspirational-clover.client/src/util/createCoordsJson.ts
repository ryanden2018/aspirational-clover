import { Coord } from "../data/shapes";

export function createCoordsJson(coords: Coord[]) {
  return JSON.stringify({ coords: coords ?? [] });
}
