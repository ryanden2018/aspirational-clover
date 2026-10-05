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
    return {
      ...document,
      layers: (document.layers ?? []).map(layer => {
        if (layer.clientUuid === layerClientUuid) {
          return { ...layer, zIndex: update.payload.forward.zIndex}
        }

        if (layer.zIndex < update.payload.forward.zIndex) {
          return layer;
        }

        return { ...layer, zIndex: layer.zIndex + 1 };
      }),
    };
  }

  return {
    ...document,
    layers: (document.layers ?? []).map(layer => {
      if (layer.clientUuid === layerClientUuid) {
        return { ...layer, zIndex: update.payload.reverse.zIndex };
      }

      if (layer.zIndex < oldZIndex) {
        return layer;
      }

      return { ...layer, zIndex: layer.zIndex - 1 };
    });
  };
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
