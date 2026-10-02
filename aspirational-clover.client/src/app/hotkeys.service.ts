import { Injectable } from "@angular/core";

import { SelectionService } from "./selection.service";
import { UndoService } from "./undo.service";

@Injectable({
  providedIn: "root"
})
export class HotkeysService {
  constructor(private _selectionService: SelectionService, private _undoService: UndoService) {}

  connectDeleteKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key === "Delete") {
        this._selectionService.deleteSelectedShape();
      }
    })
  }

  connectCtrlZKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "z" && e.ctrlKey && !e.shiftKey && !e.metaKey) {
        this._undoService.undo();
      }
    });
  }

  connectCtrlShiftZKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "z" && e.ctrlKey && e.shiftKey && !e.metaKey) {
        this._undoService.redo();
      }
    });
  }

  connectCtrlYKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "y" && e.ctrlKey && !e.shiftKey && !e.metaKey) {
        this._undoService.redo();
      }
    });
  }

  connectCtrlCKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "c" && e.ctrlKey && !e.shiftKey && !e.metaKey) {
        this._selectionService.copySelectedShapeToClipboard();
      }
    })
  }

  connectCtrlVKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "v" && e.ctrlKey && !e.shiftKey && !e.metaKey) {
        this._selectionService.pasteShapeFromClipboard();
      }
    })
  }
}
