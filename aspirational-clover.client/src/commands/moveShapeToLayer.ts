import { MoveShapeToLayerCommand } from "../data/commands";
import { AppDocument, Layer } from "../data/model";
import { Shape } from "../data/shapes";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";

export function applyMoveShapeToLayer(document: AppDocument, update: MoveShapeToLayerCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update || !direction) return document;
  const shapeClientUuid = update?.shapeClientUuid;

  let foundShape: Shape | null = null;

  const intermediateDocument = {
    ...document,
    layers: (document.layers ?? []).map(layer => ({
      ...layer,
      shapes: (layer?.shapes ?? []).filter(shape => {
        if (shapeClientUuid === getClientUuidFromShape(shape)) {
          foundShape = shape;
          return false;
        }
        return true;
      }),
    }))
  };

  if (!foundShape) return document;

  const targetLayerClientUuid = update?.payload?.[direction]?.layerClientUuid;

  let layerWasUpdated: boolean = false;

  const updatedDocument = {
    ...intermediateDocument,
    layers: (intermediateDocument.layers ?? []).map(layer => {
      if (layer.clientUuid === targetLayerClientUuid) {
        layerWasUpdated = true;
        return {...layer,
          shapes: [...(layer.shapes ?? []), {
            ...foundShape,
            layerId: layer.id,
            circle: foundShape?.circle ? { ...foundShape.circle, layerId: layer.id } : null,
            rectangle: foundShape?.rectangle ? { ...foundShape.rectangle, layerId: layer.id } : null,
            textBox: foundShape?.textBox ? { ...foundShape.textBox, layerId: layer.id } : null,
            polyline: foundShape?.polyline ? { ...foundShape.polyline, layerId: layer.id } : null,
          }]
        }
      }

      return layer;
    })
  }

  return layerWasUpdated ? updatedDocument : document;
}

export function createMoveShapeToLayerCommand(initial: Layer, target: Layer, shapeClientUuid: string): MoveShapeToLayerCommand | null {
  return {
    type: "moveShapeToLayer",
    shapeClientUuid,
    payload: {
      forward: { layerClientUuid: target.clientUuid },
      reverse: { layerClientUuid: initial.clientUuid },
    }
  }
}
