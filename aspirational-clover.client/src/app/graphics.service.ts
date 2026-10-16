import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, switchMap, scan, throttleTime, takeUntil, tap, map, last, of, Subscription } from "rxjs";

import { Shape } from "../data/shapes";
import { GraphicsMouseEvent } from "../types";
import { createShapeUpdateCommand } from "../commands/updateShape";
import { createAddShapeCommand } from "../commands/addShape";
import { UndoService } from "./undo.service";
import { DocumentService } from "./document.service";
import { ShapeToolsService } from "./shape-tools.service";
import { SelectionService } from "./selection.service";
import { truncateFloat } from "../util/truncateFloat";
import { newUuidV4 } from "../util/uuid";
import { UpdateShapeCommand } from "../data/commands";
import { getClientUuidFromShape } from "../util/getClientUuidFromShape";

@Injectable({
  providedIn: "root"
})
export class GraphicsService {
  private _mouseEventSignal = signal<GraphicsMouseEvent | null>(null);
  private _graphicsSubscription: Subscription | undefined;

  constructor(
    private _undoService: UndoService,
    private _documentService: DocumentService,
    private _shapeToolsService: ShapeToolsService,
    private _selectionService: SelectionService,
  ) {}

  pushEvent(event: GraphicsMouseEvent) {
    this._mouseEventSignal.set(event);
  }

  getInitialShape(event: MouseEvent, mode: "rectangle" | "circle" | "polyline" | "textbox"): Shape | null {
    const layerId = this._documentService.selectedLayer()?.id;

    if (layerId === undefined) return null;

    switch (mode) {
      case 'rectangle':
        return { layerId, circle: null, textBox: null, polyline: null, rectangle: {
          x: truncateFloat(event.offsetX ?? 0, 0),
          y: truncateFloat(event.offsetY ?? 0, 0),
          width: 0,
          height: 0,
          fillColorFrom: "#333333",
          fillColorTo: "#999999",
          fillAngle: 0,
          id: 0,
          clientUuid: newUuidV4(),
          layerId,
          rotationAngle: 0,
          rotationCenterOffsetX: 0,
          rotationCenterOffsetY: 0,
          skewX: 0,
          skewY: 0,
        } };
      case 'circle':
        return { layerId, rectangle: null, textBox: null, polyline: null, circle: {
          centerX: truncateFloat(event.offsetX ?? 0, 0),
          centerY: truncateFloat(event.offsetY ?? 0, 0),
          radius: 0,
          fillColorFrom: "#333333",
          fillColorTo: "#999999",
          fillAngle: 0,
          id: 0,
          clientUuid: newUuidV4(),
          layerId,
          rotationAngle: 0,
          rotationCenterOffsetX: 0,
          rotationCenterOffsetY: 0,
          skewX: 0,
          skewY: 0,
        } };
      case 'textbox':
        return { layerId, circle: null, rectangle: null, polyline: null, textBox: {
          x: truncateFloat(event.offsetX ?? 0, 0),
          y: truncateFloat(event.offsetY ?? 0, 0),
          id: 0,
          clientUuid: newUuidV4(),
          layerId,
          content: "{\"text\":\"Click to enter text (no sensitive data!)\"}",
          fontSize: 24,
        } };
      default:
        return null;
    }
  }

  updateShapeForShapesTool(shape: Shape, dx: number, dy: number, shapeClientUuid?: string | null | undefined): Shape | null {
     if (shape.circle) {
       return { ...shape, circle: { ...shape.circle, radius: truncateFloat(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)), 0), clientUuid: shapeClientUuid ?? shape.circle.clientUuid }};
     }

     if (shape.rectangle) {
       return { ...shape, rectangle: { ...shape.rectangle, width: truncateFloat(dx, 0), height: truncateFloat(dy, 0), clientUuid: shapeClientUuid ?? shape.rectangle.clientUuid }};
     }

     if (shape.textBox) {
       return { ...shape, textBox: { ...shape.textBox, x: truncateFloat(shape.textBox.x + dx, 0), y: truncateFloat(shape.textBox.y + dy, 0), clientUuid: shapeClientUuid ?? shape.textBox.clientUuid }};
     }

     return null;
  }

  subscribeGraphicsMouseEvent() {
    this._graphicsSubscription?.unsubscribe?.();
    const mouse$ = toObservable(this._mouseEventSignal);
    const mouseDown$ = mouse$.pipe(filter(ev => ev?.type === "down"));
    const mouseUp$ = mouse$.pipe(filter(ev => ev?.type === "up"));
    const mouseMove$ = mouse$.pipe(filter(ev => ev?.type === "move"));

    type MoveAccumulator = {
      x: number | null;
      y: number | null;
      dx: number;
      dy: number;
    }

    const moveAccumulator = (acc: MoveAccumulator, value: GraphicsMouseEvent | null): MoveAccumulator => {
      if (acc.x === null || acc.y === null) {
        return {
          x: value?.event?.offsetX ?? null,
          y: value?.event?.offsetY ?? null,
          dx: 0,
          dy: 0,
        }
      } else {
        return {
          x: acc.x,
          y: acc.y,
          dx: (value?.event?.offsetX ?? 0) - (acc.x ?? 0),
          dy: (value?.event?.offsetY ?? 0) - (acc.y ?? 0),
        }
      }
    };

    this._graphicsSubscription = mouseDown$.pipe(
      switchMap(mouseDownEvent => {
        if (mouseDownEvent?.shape) {
          // target is a shape
          return mouseMove$.pipe(
            takeUntil(mouseUp$),
            scan(moveAccumulator, { x: null, y: null, dx: 0, dy: 0 } as MoveAccumulator),
            throttleTime(10),
            map(coords => {
              if (mouseDownEvent?.updater && mouseDownEvent?.shape) {
                const newShape = mouseDownEvent?.updater(mouseDownEvent?.shape, { dx: coords.dx, dy: coords.dy } );
                return createShapeUpdateCommand(mouseDownEvent?.shape, newShape);
              }
              return null;
            }),
            filter(x => !!x),
            tap(command => {
              this._undoService.applyCommand(command, "forward");
            }),
            last(),
            tap(command => {
              this._undoService.pushCommand(command);
            })
          );
        } else {
          // target is svg, we are creating a new shape
          const mode = this._shapeToolsService.mode();

          if (mouseDownEvent?.event && mode) {
            const isClickOnlyEvent = mode === "textbox" || mode === "polyline";
            const initialShape = this.getInitialShape(mouseDownEvent?.event, mode);
            const selectedLayer = this._documentService.selectedLayer();
            const selectedLayerClientUuid = selectedLayer?.clientUuid;

            if (!selectedLayerClientUuid || !initialShape) return of(null);

            const addShapeCommand = createAddShapeCommand(selectedLayerClientUuid, initialShape);

            if (!addShapeCommand) return of(null);

            return mouseMove$.pipe(
              takeUntil(mouseUp$),
              tap(() => {
                if (this._shapeToolsService.mode()) {
                  this._shapeToolsService.setMode(null); // only execute this side effect once
                  this._undoService.applyCommand(addShapeCommand, "forward");
                  if (isClickOnlyEvent) {
                    this._undoService.pushCommand(addShapeCommand);
                  }
                }
              }),
              filter(() => !isClickOnlyEvent),
              scan(moveAccumulator, { x: null, y: null, dx: 0, dy: 0 } as MoveAccumulator),
              throttleTime(10),
              map(coords => {
                const newShape = this.updateShapeForShapesTool(initialShape, coords.dx, coords.dy) ?? initialShape;
                const command = createShapeUpdateCommand(initialShape, newShape);
                if (!command) return null;
                return { command, dx: coords.dx, dy: coords.dy };
              }),
              filter(x => !!x),
              tap(({ command }) => {
                this._undoService.applyCommand(command, "forward");
              }),
              last(),
              tap(({ dx, dy }: { command: UpdateShapeCommand, dx: number, dy: number }) => {
                const newShape = this.updateShapeForShapesTool(addShapeCommand.payload.forward, dx, dy, getClientUuidFromShape(addShapeCommand.payload.forward));
                if (newShape) {
                  const newCommand = { ...addShapeCommand, payload: { reverse: null, forward: newShape }};
                  this._undoService.pushCommand(newCommand);
                }

                const shapeClientUuid = getClientUuidFromShape(addShapeCommand.payload.forward);
                if (shapeClientUuid) {
                  setTimeout(() => {
                    this._selectionService.setSelectedShapeClientUuid(shapeClientUuid);
                  }, 10);
                }
              }),
            );
          }

          return of(null);
        }
      })
    ).subscribe(() => {});
  }

  connectWindowMouseUpListener() {
    window.document.addEventListener("mouseup", ev => {
      this._mouseEventSignal.set({
        type: "up",
        event: ev,
      });
    });
  }
}
