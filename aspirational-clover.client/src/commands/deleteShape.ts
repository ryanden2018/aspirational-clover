import { DeleteShapeCommand } from "../data/commands";
import { AppDocument } from "../data/model";
import { Shape } from "../data/shapes";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";

export function applyDeleteShapeCommand(document: AppDocument, update: DeleteShapeCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update?.payload?.reverse || !direction) return document;

  const layerClientUuid = update?.layerClientUuid;
  const shapeClientUuid = getClientUuidFromShape(update?.payload?.reverse);

  if (direction === "forward") {
    return {...document, layers: (document.layers ?? []).map(layer => ({
      ...layer,
      shapes: (layer?.shapes ?? []).filter(s => getClientUuidFromShape(s) !== shapeClientUuid)
    }))};
  }

  return {...document, layers: (document.layers ?? []).map(layer =>
    layer.clientUuid === layerClientUuid ? {
      ...layer,
      shapes: [...(layer?.shapes ?? []), update?.payload?.reverse]
    } : layer
  )};
}

export function createDeleteShapeCommand(layerClientUuid: string, shape: Shape): DeleteShapeCommand | null {
  if (!shape || !layerClientUuid) return null;

  return {
    type: "deleteShape",
    layerClientUuid,
    payload: {
      forward: null,
      reverse: shape,
    }
  };
}
