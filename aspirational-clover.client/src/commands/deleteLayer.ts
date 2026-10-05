import { DeleteLayerCommand } from "../data/commands";
import { AppDocument, Layer } from "../data/model";

export function applyDeleteLayerCommand(document: AppDocument, update: DeleteLayerCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update?.payload?.reverse || !direction) return document;

  if (direction === "forward") {
    return {
      ...document,
      layers: (document.layers ?? []).filter(layer => layer.clientUuid !== update.layerClientUuid),
    };
  }

  return {
    ...document,
    layers: [...(document.layers ?? []), update.payload.reverse]
  };
}

export function createDeleteLayerCommand(layer: Layer): DeleteLayerCommand | null {
  if (!layer?.clientUuid) return null;

  return {
    type: "deleteLayer",
    layerClientUuid: layer.clientUuid,
    payload: {
      forward: null,
      reverse: layer,
    }
  }
}
