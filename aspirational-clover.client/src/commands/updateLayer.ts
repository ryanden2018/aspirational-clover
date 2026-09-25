import { UpdateLayerCommand } from "../data/commands";
import { AppDocument, Layer, LayerUpdate } from "../data/model";
import { getShallowDiff } from "../util/getShallowDiff";

export function applyUpdateLayer(document: AppDocument, update: UpdateLayerCommand, direction: "forward" | "reverse") {
  if (!document || !update || !direction) return document;

  const patch = update.payload?.[direction];

  const layerClientUuid = update.layerClientUuid;

  if (!patch) return document;

  return {...document,
    layers: (document.layers ?? []).map(layer => {
      if (layer.clientUuid === layerClientUuid) {
        return { ...layer, ...patch };;
      }

      return layer;
    })
  }
}

function extractLayerUpdate(layer: Layer): LayerUpdate {
  // IMPORTAND: do not override SHAPES (we do not update shapes using this command !!)
  const { id, documentId, clientUuid, shapes, ...rest } = layer;
  return rest;
}

export function createLayerUpdateCommand(initial: Layer, target: Layer): UpdateLayerCommand | null {
  if (!initial || !target) return null;

  const initialLayerUpdate: LayerUpdate = extractLayerUpdate(initial);
  const targetLayerUpdate: LayerUpdate = extractLayerUpdate(target);

  return {
    type: "updateLayer",
    layerClientUuid: initial.clientUuid,
    payload: {
      forward: getShallowDiff(initialLayerUpdate, targetLayerUpdate),
      reverse: getShallowDiff(targetLayerUpdate, initialLayerUpdate),
    }
  }
}

