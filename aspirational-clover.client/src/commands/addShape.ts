import { AddShapeCommand } from "../data/commands";
import { AppDocument } from "../data/model";
import { Shape } from "../data/shapes";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";

export function applyAddShapeCommand(document: AppDocument, update: AddShapeCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update?.payload?.forward || !direction) return document;

  const layerClientUuid = update?.layerClientUuid;
  const shapeClientUuid = getClientUuidFromShape(update?.payload?.forward);

  if (direction === "reverse") {
    return {...document, layers: (document.layers ?? []).map(layer => ({
      ...layer,
      shapes: (layer?.shapes ?? []).filter(s => getClientUuidFromShape(s) !== shapeClientUuid)
    }))};
  }

  return {...document, layers: (document.layers ?? []).map(layer =>
    layer.clientUuid === layerClientUuid ? {
      ...layer,
      shapes: [...(layer?.shapes ?? []), update?.payload?.forward]
    } : layer
  )};
}

export function createAddShapeCommand(layerClientUuid: string, shape: Shape): AddShapeCommand | null {
  if (!shape || !layerClientUuid) return null;

  return {
    type: "addShape",
    layerClientUuid,
    payload: {
      forward: shape,
      reverse: null,
    }
  };
}
