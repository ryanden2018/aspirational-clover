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
    forward: { layerClientUuid: number };
    reverse: { layerClientUuid: number };
  }
}

export interface UpdateLayerCommand {
  type: "updateLayer",
  layerClientUuid: string,
  payload: {
    forward: LayerUpdate,
    reverse: LayerUpdate,
  }
}

export interface UpdateDocumentCommand {
  type: "updateDocument",
  documentClientUuid: string,
  payload: {
    forward: DocumentUpdate,
    reverse: DocumentUpdate,
  }
}

export type Command = UpdateShapeCommand | MoveShapeToLayerCommand | UpdateLayerCommand | UpdateDocumentCommand;

export type LinkedCommand = Command & { next: Command | null };
