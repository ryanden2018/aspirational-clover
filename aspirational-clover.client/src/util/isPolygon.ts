import { Polyline } from "../data/shapes";
import { getCoords } from "./getCoords";

export function isPolygon(polyline: Polyline) {
  const coords = getCoords(polyline);
  return coords.length > 3 &&
    coords[coords.length-1]?.x === coords[0]?.x &&
    coords[coords.length-1]?.y === coords[0]?.y;
}
