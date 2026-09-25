import { Injectable, signal } from "@angular/core";

import { LinkedCommand, Command } from "../data/commands";
import { DocumentService } from "./document.service";
import { isMoveShapeToLayerCommand, isUpdateDocumentCommand, isUpdateLayerCommand, isUpdateShapeCommand } from "../data/typeguards";
import { applyMoveShapeToLayer } from "../commands/moveShapeToLayer";
import { applyUpdateDocument } from "../commands/updateDocument";
import { applyUpdateLayer } from "../commands/updateLayer";
import { applyShapeUpdate } from "../commands/updateShape";

interface UndoRedoState {
  undo: LinkedCommand | null;
  redo: LinkedCommand | null;
}

@Injectable({
  providedIn: "root"
})
export class UndoService {
  state = signal<Record<string, UndoRedoState>>({});

  constructor(private _documentService: DocumentService) {}

  pushCommand(command: Command) {
    const documentClientUuid = this._documentService.activeDocumentClientUuid();
    const current = this.state()[documentClientUuid];
    if (!current) {
      this.state.set({...this.state(), [documentClientUuid]: {
        undo: { ...command, next: null },
        redo: null
      }});
      return;
    }

    this.state.set({ ...this.state(), [documentClientUuid]: {
      undo: { ...command, next: current.undo },
      redo: null, // pushing clears the redo stack
    }});
  }

  private _applyCommand(command: Command, direction: "forward" | "reverse") {
    const currentDocument = this._documentService.activeDocument();

    if (!currentDocument) return;

    if (isMoveShapeToLayerCommand(command)) {
      this._documentService.updateDocumentInMemory(applyMoveShapeToLayer(currentDocument, command, direction));
    }

    if (isUpdateDocumentCommand(command)) {
      this._documentService.updateDocumentInMemory(applyUpdateDocument(currentDocument, command, direction));
    }

    if (isUpdateLayerCommand(command)) {
      this._documentService.updateDocumentInMemory(applyUpdateLayer(currentDocument, command, direction));
    }

    if (isUpdateShapeCommand(command)) {
      this._documentService.updateDocumentInMemory(applyShapeUpdate(currentDocument, command, direction));
    }
  }

  undo() {
    const documentClientUuid = this._documentService.activeDocumentClientUuid();
    if (!documentClientUuid) return;
    const currentState = this.state()[documentClientUuid];
    if (!currentState) return;
    const { undo, redo } = currentState;
    if (!undo) return;
    this._applyCommand(undo, "reverse");
    this.state.set({...this.state(), [documentClientUuid]: {
      undo: undo.next,
      redo: { ...undo, next: redo }
    }});
  }

  redo() {
    const documentClientUuid = this._documentService.activeDocumentClientUuid();
    if (!documentClientUuid) return;
    const currentState = this.state()[documentClientUuid];
    if (!currentState) return;
    const { undo, redo } = currentState;
    if (!redo) return;
    this._applyCommand(redo, "forward");
    this.state.set({...this.state(), [documentClientUuid]: {
      undo: { ...redo, next: undo },
      redo: redo.next,
    }});
  }
}
