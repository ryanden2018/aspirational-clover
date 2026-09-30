import { Injectable } from "@angular/core";

import { SelectionService } from "./selection.service";

@Injectable({
  providedIn: "root"
})
export class HotkeysService {
  constructor(private _selectionService: SelectionService) {}

  connectDeleteKeydown() {
    window.document.addEventListener("keydown", e => {
      if (e.key === "Delete") {
        this._selectionService.deleteSelectedShape();
      }
    })
  }
}
