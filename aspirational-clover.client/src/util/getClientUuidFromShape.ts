import { Shape } from "../data/shapes";

export function getClientUuidFromShape(shape: Shape) {
  return shape?.circle?.clientUuid ?? shape?.rectangle?.clientUuid ?? shape?.textBox?.clientUuid ?? shape?.polyline?.clientUuid;
}
