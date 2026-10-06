import { ReorderLayerCommand } from "../data/commands";
import { AppDocument, LayerUpdate } from "../data/model";

export function applyReorderLayerCommand(document: AppDocument, update: ReorderLayerCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update || !direction) return document;

  const { layerClientUuid } = update;

  if (!layerClientUuid) return document;

  if (typeof update.payload?.forward?.zIndex !== "number") return document;

  if (typeof update.payload?.reverse?.zIndex !== "number") return document;

  const layerToReorder = (document.layers ?? []).find(layer => layer?.clientUuid === layerClientUuid);

  if (!layerToReorder) return document;

  const oldZIndex = layerToReorder.zIndex;

  if (typeof oldZIndex !== "number") return document;

  if (direction === "forward") {
    const minZIndex = Math.min(oldZIndex, update.payload.forward.zIndex);
    const maxZIndex = Math.max(oldZIndex, update.payload.forward.zIndex);
    const differential = (oldZIndex < update.payload.forward.zIndex) ? -1 : 1;
    return {
      ...document,
      layers: (document.layers ?? []).map(layer => {
        if (layer.clientUuid === layerClientUuid) {
          return { ...layer, zIndex: update.payload.forward.zIndex}
        }

        if (layer.zIndex < minZIndex || layer.zIndex > maxZIndex) {
          return layer;
        }

        return { ...layer, zIndex: layer.zIndex + differential };
      }),
    };
  } else {
    const minZIndex = Math.min(oldZIndex, update.payload.reverse.zIndex);
    const maxZIndex = Math.max(oldZIndex, update.payload.reverse.zIndex);
    const differential = (oldZIndex < update.payload.reverse.zIndex) ? -1 : 1;
    return {
      ...document,
      layers: (document.layers ?? []).map(layer => {
        if (layer.clientUuid === layerClientUuid) {
          return { ...layer, zIndex: update.payload.reverse.zIndex };
        }

        if (layer.zIndex < minZIndex || layer.zIndex > maxZIndex) {
          return layer;
        }

        return { ...layer, zIndex: layer.zIndex + differential };
      }),
    };
  }
}

export function createReorderLayerCommand(layerClientUuid: string, initial: Pick<LayerUpdate, "zIndex">, target: Pick<LayerUpdate, "zIndex">): ReorderLayerCommand | null {
  if (!layerClientUuid || !initial || !target) return null;

  return {
    type: "reorderLayer",
    layerClientUuid,
    payload: {
      forward: target,
      reverse: initial,
    }
  }
}
