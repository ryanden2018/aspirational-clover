import { ShapeUpdate, Shape } from "./shapes";
import { LayerUpdate, Layer, DocumentUpdate } from "./model";

export interface AddLayerCommand {
  type: "addLayer",
  layerClientUuid: string,
  payload: {
    forward: Layer,
    reverse: null,
  }
}

export interface DeleteLayerCommand {
  type: "deleteLayer",
  layerClientUuid: string,
  payload: {
    forward: null,
    reverse: Layer,
  }
}

export interface ReorderLayerCommand {
  type: "reorderLayer",
  layerClientUuid: string,
  payload: {
    forward: Pick<LayerUpdate, "zIndex">,
    reverse: Pick<LayerUpdate, "zIndex">,
  }
}

export interface AddShapeCommand {
  type: "addShape",
  layerClientUuid: string,
  payload: {
    forward: Shape,
    reverse: null,
  }
}

export interface DeleteShapeCommand {
  type: "deleteShape",
  layerClientUuid: string,
  payload: {
    forward: null,
    reverse: Shape,
  }
}

export interface UpdateShapeCommand {
  type: "updateShape",
  shapeClientUuid: string,
  payload: {
    forward: Omit<ShapeUpdate, "layerId">;
    reverse: Omit<ShapeUpdate, "layerId">;
  }
}

export interface MoveShapeToLayerCommand {
  type: "moveShapeToLayer",
  shapeClientUuid: string,
  payload: {
    forward: { layerClientUuid: string };
    reverse: { layerClientUuid: string };
  }
}

export interface UpdateLayerCommand {
  type: "updateLayer",
  layerClientUuid: string,
  payload: {
    forward: Partial<LayerUpdate>,
    reverse: Partial<LayerUpdate>,
  }
}

export interface UpdateDocumentCommand {
  type: "updateDocument",
  documentClientUuid: string,
  payload: {
    forward: Partial<DocumentUpdate>,
    reverse: Partial<DocumentUpdate>,
  }
}

export type Command = UpdateShapeCommand
  | MoveShapeToLayerCommand
  | UpdateLayerCommand
  | UpdateDocumentCommand
  | AddShapeCommand
  | DeleteShapeCommand
  | ReorderLayerCommand
  | AddLayerCommand
  | DeleteLayerCommand;

export type LinkedCommand = Command & { next: LinkedCommand | null };
