import { Injectable } from "@angular/core";

import { SelectionService } from "./selection.service";
import { UndoService } from "./undo.service";

@Injectable({
  providedIn: "root"
})
export class HotkeysService {
  constructor(private _selectionService: SelectionService, private _undoService: UndoService) {}

  deleteKeydownHandler = (ev: KeyboardEvent) => {
    if (ev.key === "Delete") {
      this._selectionService.deleteSelectedShape();
    }
  };

  connectDeleteKeydown() {
    window.document.removeEventListener("keydown", this.deleteKeydownHandler);
    window.document.addEventListener("keydown", this.deleteKeydownHandler);
  }

  ctrlZKeydownHandler = (ev: KeyboardEvent) => {
    if (ev.key.toLowerCase() === "z" && ev.ctrlKey && !ev.shiftKey && !ev.metaKey) {
      this._undoService.undo();
    }
  };

  connectCtrlZKeydown() {
    window.document.removeEventListener("keydown", this.ctrlZKeydownHandler);
    window.document.addEventListener("keydown", this.ctrlZKeydownHandler);
  }

  ctrlShiftZKeydownHandler = (ev: KeyboardEvent) => {
    if (ev.key.toLowerCase() === "z" && ev.ctrlKey && ev.shiftKey && !ev.metaKey) {
      this._undoService.redo();
    }
  };

  connectCtrlShiftZKeydown() {
    window.document.removeEventListener("keydown", this.ctrlShiftZKeydownHandler);
    window.document.addEventListener("keydown", this.ctrlShiftZKeydownHandler);
  }

  ctrlYKeydownHandler = (ev: KeyboardEvent) => {
    if (ev.key.toLowerCase() === "y" && ev.ctrlKey && !ev.shiftKey && !ev.metaKey) {
      this._undoService.redo();
    }
  };

  connectCtrlYKeydown() {
    window.document.removeEventListener("keydown", this.ctrlYKeydownHandler);
    window.document.addEventListener("keydown", this.ctrlYKeydownHandler);
  }

  ctrlCKeydownHandler = (ev: KeyboardEvent) =>  {
    if (ev.key.toLowerCase() === "c" && ev.ctrlKey && !ev.shiftKey && !ev.metaKey) {
      this._selectionService.copySelectedShapeToClipboard();
    }
  };

  connectCtrlCKeydown() {
    window.document.removeEventListener("keydown", this.ctrlCKeydownHandler);
    window.document.addEventListener("keydown", this.ctrlCKeydownHandler);
  }

  ctrlVKeydownHandler = (ev: KeyboardEvent) => {
    if (ev.key.toLowerCase() === "v" && ev.ctrlKey && !ev.shiftKey && !ev.metaKey) {
      this._selectionService.pasteShapeFromClipboard();
    }
  };

  connectCtrlVKeydown() {
    window.document.removeEventListener("keydown", this.ctrlVKeydownHandler);
    window.document.addEventListener("keydown", this.ctrlVKeydownHandler);
  }
}
