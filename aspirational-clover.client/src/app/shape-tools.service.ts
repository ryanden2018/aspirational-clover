import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ShapeToolsService {
  private _mode = signal<"rectangle" | "circle" | "polyline" | "textbox" | null>(null);

  setMode(mode: "rectangle" | "circle" | "polyline" | "textbox" | null) {
    this._mode.set(mode);
  }

  mode = this._mode.asReadonly();
}
