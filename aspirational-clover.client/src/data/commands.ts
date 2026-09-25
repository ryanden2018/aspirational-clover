import { ShapeUpdate } from "./shapes";
import { LayerUpdate, DocumentUpdate } from "./model";

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

export type Command = UpdateShapeCommand | MoveShapeToLayerCommand | UpdateLayerCommand | UpdateDocumentCommand;

export type LinkedCommand = Command & { next: LinkedCommand | null };
