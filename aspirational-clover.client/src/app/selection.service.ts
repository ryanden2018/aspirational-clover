import { Injectable, signal, computed } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";

import { ClipboardService } from "./clipboard.service";
import { DocumentService } from "./document.service";
import { UndoService } from "./undo.service";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";
import { newUuidV4 } from "../util/uuid";
import { Shape } from "../data/shapes";
import { createAddShapeCommand } from "../commands/addShape";

@Injectable({
  providedIn: "root"
})
export class SelectionService {
  private _selectedShapeClientUuid = signal<string | null>(null);

  constructor(
    private _clipboardService: ClipboardService,
    private _undoService: UndoService,
    private _documentService: DocumentService,
  ) {}

  setSelectedShapeClientUuid(clientUuid: string | null) {
    this._selectedShapeClientUuid.set(clientUuid);
  }

  selectedShapeClientUuid = this._selectedShapeClientUuid.asReadonly();

  modeAsObservable = toObservable(this.selectedShapeClientUuid);

  selectedShape = computed(() => this._documentService.activeDocument()
      ?.layers
      ?.flatMap(layer => layer?.shapes ?? [])
      ?.find(shape => getClientUuidFromShape(shape) === this._selectedShapeClientUuid()));

  copySelectedShapeToClipboard() {
    const shape = this.selectedShape();
    if (!shape) return;
    this._clipboardService.copy(JSON.stringify(shape));
  }

  processPastedShape(shape: Shape): Shape | null {
    const delta = 3;
    if (shape?.circle) {
      return { ...shape, circle: { ...shape.circle, clientUuid: newUuidV4(), centerX: shape.circle.centerX + delta, centerY: shape.circle.centerY + delta }}
    }

    if (shape?.rectangle) {
      return { ...shape, rectangle: { ...shape.rectangle, clientUuid: newUuidV4(), x: shape.rectangle.x + delta, y: shape.rectangle.y + delta }};
    }

    return null;
  }

  pasteShapeFromClipboard() {
    try {
      const shapeFromClipboard = JSON.parse(this._clipboardService.content() ?? "") as Shape;
      const newShape = this.processPastedShape(shapeFromClipboard);
      if (!newShape) return;

      // TODO: use active layer instead of default layer
      const layerClientUuid = this._documentService.activeDocument()?.layers?.[0]?.clientUuid;
      if (!layerClientUuid) return;

      const addShapeCommand = createAddShapeCommand(layerClientUuid, newShape);
      if (!addShapeCommand) return;
      this._undoService.applyCommand(addShapeCommand, "forward");
      this._undoService.pushCommand(addShapeCommand);

      const pastedShapeClientUuid = getClientUuidFromShape(addShapeCommand.payload.forward);
      if (pastedShapeClientUuid) {
        this.setSelectedShapeClientUuid(pastedShapeClientUuid);
      }
    } catch (e) {
      console.log("error pasting: ", e);
    }
  }
}
