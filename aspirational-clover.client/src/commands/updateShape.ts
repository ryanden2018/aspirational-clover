import { AppDocument } from "../data/model";
import { Shape, Circle, Rectangle, TextBox, Polyline } from "../data/shapes";
import { UpdateShapeCommand } from "../data/commands";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";
import { getShallowDiff } from "../util/getShallowDiff";

export function applyShapeUpdate(document: AppDocument, update: UpdateShapeCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !document?.layers || !update) return document;
  const shapeClientUuid = update?.shapeClientUuid;
  const patch = update?.payload?.[direction];
  if (!shapeClientUuid || !patch) return document;
  return {...document,
    layers: (document.layers ?? []).map(layer => ({...layer, shapes: (layer.shapes ?? []).map(shape => {
      if (getClientUuidFromShape(shape) !== shapeClientUuid) {
        return shape;
      }

      if (shape?.circle && patch?.circle) {
        return { ...shape, circle: { ...shape.circle, ...patch.circle }};
      }

      if (shape?.rectangle && patch?.rectangle) {
        return { ...shape, rectangle: { ...shape.rectangle, ...patch.rectangle }};
      }

      if (shape?.textBox && patch?.textBox) {
        return { ...shape, textBox: { ...shape.textBox, ...patch.textBox }};
      }

      if (shape?.polyline && patch?.polyline) {
        return { ...shape, polyline: { ...shape.polyline, ...patch.polyline }};
      }

      return shape;
    }) }))
  }
}

export function createShapeUpdateCommand(initial: Shape, target: Shape): UpdateShapeCommand | null {
  if (initial?.circle && target?.circle) {
    return {
      type: "updateShape",
      shapeClientUuid: initial?.circle?.clientUuid,
      payload: {
        forward: {
          circle: getShallowDiff(initial.circle, target.circle) as Omit<Partial<Circle>, "layerId" | "id" | "clientUuid">,
        },
        reverse: {
          circle: getShallowDiff(target.circle, initial.circle) as Omit<Partial<Circle>, "layerId" | "id" | "clientUuid">,
        }
      }
    }
  }

  if (initial?.rectangle && target?.rectangle) {
    return {
      type: "updateShape",
      shapeClientUuid: initial?.rectangle?.clientUuid,
      payload: {
        forward: {
          rectangle: getShallowDiff(initial.rectangle, target.rectangle) as Omit<Partial<Rectangle>, "layerId" | "id" | "clientUuid">,
        },
        reverse: {
          rectangle: getShallowDiff(target.rectangle, initial.rectangle) as Omit<Partial<Rectangle>, "layerId" | "id" | "clientUuid">,
        }
      }
    }
  }

  if (initial?.textBox && target?.textBox) {
    return {
      type: "updateShape",
      shapeClientUuid: initial?.textBox?.clientUuid,
      payload: {
        forward: {
          textBox: getShallowDiff(initial.textBox, target.textBox) as Omit<Partial<TextBox>, "layerId" | "id" | "clientUuid">,
        },
        reverse: {
          textBox: getShallowDiff(target.textBox, initial.textBox) as Omit<Partial<TextBox>, "layerId" | "id" | "clientUuid">,
        }
      }
    }
  }

  if (initial?.polyline && target?.polyline) {
    return {
      type: "updateShape",
      shapeClientUuid: initial?.polyline?.clientUuid,
      payload: {
        forward: {
          polyline: getShallowDiff(initial.polyline, target.polyline) as Omit<Partial<Polyline>, "layerId" | "id" | "clientUuid">,
        },
        reverse: {
          polyline: getShallowDiff(target.polyline, initial.polyline) as Omit<Partial<Polyline>, "layerId" | "id" | "clientUuid">,
        }
      }
    }
  }

  return null;
}
