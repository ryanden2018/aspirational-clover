import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";

import { SelectionService } from "./selection.service";

@Injectable({
  providedIn: "root"
})
export class ShapeToolsService {
  constructor (private _selectionService: SelectionService) {}

  private _mode = signal<"rectangle" | "circle" | "polyline" | "textbox" | null>(null);

  setMode(mode: "rectangle" | "circle" | "polyline" | "textbox" | null) {
    if (mode !== null) {
      this._selectionService.setSelectedShapeClientUuid(null);
    }
    this._mode.set(mode);
  }

  mode = this._mode.asReadonly();

  modeAsObservable = toObservable(this.mode);
}
