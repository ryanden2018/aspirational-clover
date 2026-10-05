import { AddLayerCommand } from "../data/commands";
import { AppDocument, Layer } from "../data/model";

export function applyAddLayerCommand(document: AppDocument, update: AddLayerCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update.payload.forward || !direction) return document;

  if (direction === "reverse") {
    return {
      ...document,
      layers: (document.layers ?? []).filter(layer => layer.clientUuid !== update.layerClientUuid)
    };
  }

  return {
    ...document,
    layers: [...(document.layers ?? []), update.payload.forward]
  };
}

export function createAddLayerCommand(layer: Layer): AddLayerCommand | null {
  if (!layer?.clientUuid) return null;

  return {
    type: "addLayer",
    layerClientUuid: layer?.clientUuid,
    payload: {
      forward: layer,
      reverse: null,
    }
  }
}
