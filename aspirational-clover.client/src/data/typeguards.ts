import { Command, UpdateShapeCommand, MoveShapeToLayerCommand, UpdateLayerCommand, UpdateDocumentCommand } from "./commands";

export const isUpdateShapeCommand: (command: Command) => command is UpdateShapeCommand = command => command?.type === "updateShape";

export const isMoveShapeToLayerCommand: (command: Command) => command is MoveShapeToLayerCommand = command => command?.type === "moveShapeToLayer";

export const isUpdateLayerCommand: (command: Command) => command is UpdateLayerCommand = command => command?.type === "updateLayer";

export const isUpdateDocumentCommand: (command: Command) => command is UpdateDocumentCommand = command => command?.type === "updateDocument";
