import { Component, computed } from '@angular/core';
import { filter, fromEvent, map, scan, takeUntil, first, tap, withLatestFrom } from 'rxjs';

import { Layer } from "../../data/model";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { SelectionService } from "../../app/selection.service";
import { ThemeService } from "../../app/theme.service";
import { ShapeToolsService } from "../../app/shape-tools.service";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { isPolygon } from "../../util/isPolygon";
import { Circle, Rectangle, Shape } from "../../data/shapes";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { UpdateShapeCommand } from "../../data/commands";
import { newUuidV4 } from "../../util/uuid"; 
import { createAddShapeCommand } from '../../commands/addShape';
import { getClientUuidFromShape } from '../../util/getClientUuidFromShape';

@Component({
  selector: 'app-graphics-panel',
  standalone: true,
  styleUrls: ['./graphics-panel.component.css'],
  templateUrl: './graphics-panel.component.html',
})
export class GraphicsPanelComponent {
  constructor(
    private _documentService: DocumentService,
    private _undoService: UndoService,
    private _shapeToolsService: ShapeToolsService,
    private _selectionService: SelectionService,
    private _themeService: ThemeService
  ) { }

  activeDocument = computed(() => this._documentService.activeDocument());

  selectedShapeClientUuid = computed(() => this._selectionService.selectedShapeClientUuid());

  selectionOutlineColor = computed(() => this._themeService.mode() === "dark" ? "#ffffff" : "#000000");

  sortedLayers = computed(() =>
    [...(this.activeDocument()?.layers?.filter(layer => !layer?.hidden) ?? [])]
    .sort((a,b) => a?.zIndex - b?.zIndex));

  getCircles = (layer: Layer) => layer?.shapes?.map(s => s?.circle)?.filter(x => !!x) ?? [];
  getRectangles = (layer: Layer) => layer?.shapes?.map(s => s?.rectangle)?.filter(x => !!x) ?? [];
  getTextBoxes = (layer: Layer) => layer?.shapes?.map(s => s?.textBox)?.filter(x => !!x) ?? [];
  getPolylines = (layer: Layer) => layer?.shapes?.map(s => s?.polyline)?.filter(x => !!x)?.filter(x => !isPolygon(x)) ?? [];
  getPolygons = (layer: Layer) => layer?.shapes?.map(s => s?.polyline)?.filter(x => !!x)?.filter(x => isPolygon(x)) ?? [];

  getGradientId = (entity: Layerable) => `lg-${ entity?.clientUuid }`;
  getGradientFillAttr = (entity: Layerable) => `url(#${ this.getGradientId(entity) })`;
  getGradientTransform = (entity: Fillable) => `rotate(${ entity?.fillAngle })`;

  getTransformOrigin = (entity: Transformable) => `${ entity?.rotationCenterOffsetX } ${ entity?.rotationCenterOffsetY }`;
  getTransform = (entity: Transformable) => `rotate(${ entity?.rotationAngle }) skewX(${ entity?.skewX }) skewY(${ entity?.skewY })`;

  onCircleClick = (event: MouseEvent, circle: Circle) => {
    event.stopPropagation();
    this._selectionService.setSelectedShapeClientUuid(circle.clientUuid);
  }

  onRectangleClick = (event: MouseEvent, rectangle: Rectangle) => {
    event.stopPropagation();
    this._selectionService.setSelectedShapeClientUuid(rectangle.clientUuid);
  }

  onSvgClick = () => {
    this._selectionService.setSelectedShapeClientUuid(null);
  }

  getInitialShape(event: MouseEvent): Shape | null {
    const mode = this._shapeToolsService.mode();

    // TODO: use current layer instead of default layer
    const layerId = this._documentService.activeDocument()?.layers?.[0]?.id;

    if (layerId === undefined) return null;

    const backgroundColor = "#666";
    const factor = 7; // TODO: use zoom factor
    const offsetX = -20;
    const offsetY = -30;
    switch (mode) {
      case 'rectangle':
        return { layerId, circle: null, textBox: null, polyline: null, rectangle: {
          x: event.clientX / factor + offsetX,
          y: event.clientY / factor + offsetY,
          width: 0,
          height: 0,
          fillColorFrom: backgroundColor,
          fillColorTo: backgroundColor,
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
          centerX: event.clientX / factor + offsetX,
          centerY: event.clientY / factor + offsetY,
          radius: 0,
          fillColorFrom: backgroundColor,
          fillColorTo: backgroundColor,
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
      default:
        return null;
    }
  }

  updateShapeForShapesTool(shape: Shape, dx: number, dy: number, shapeClientUuid?: string | null | undefined): Shape | null {
     if (shape.circle) {
       return { ...shape, circle: { ...shape.circle, radius: Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)), clientUuid: shapeClientUuid ?? shape.circle.clientUuid }};
     }

     if (shape.rectangle) {
       return { ...shape, rectangle: { ...shape.rectangle, width: dx, height: dy, clientUuid: shapeClientUuid ?? shape.rectangle.clientUuid }};
     }

     return null;
  }

  onSvgMouseDown = (event: MouseEvent) => {
    if (this._shapeToolsService.mode() === null) return;

    const initial: Shape | null = this.getInitialShape(event);

    if (!initial) return;

    // TODO: use active layer instead of default layer
    const defaultLayer = this._documentService.activeDocument()?.layers[0];
    const defaultLayerClientUuid = defaultLayer?.clientUuid;
    
    if (!defaultLayerClientUuid) return;

    const addShapeCommand = createAddShapeCommand(defaultLayerClientUuid, initial);
    if (!addShapeCommand) return;
    this._undoService.applyCommand(addShapeCommand, "forward");

    let cancelled: boolean = false;
    let lastCommand: UpdateShapeCommand | null = null;
    let lastDx: number = 0;
    let lastDy: number = 0;
    fromEvent(window.document as any, "mouseup", { capture: "true" as any })
      .pipe(first())
      .subscribe(() => {
       if (!lastCommand) return;
        if (cancelled) {
          this._undoService.applyCommand(lastCommand, "reverse");
          this._undoService.applyCommand(addShapeCommand, "reverse");
        } else {
          const newShape = this.updateShapeForShapesTool(addShapeCommand.payload.forward, lastDx, lastDy, getClientUuidFromShape(addShapeCommand.payload.forward));
          if (newShape) {
            const newCommand = { ...addShapeCommand, payload: { reverse: null, forward: newShape }};
            this._undoService.pushCommand(newCommand);
          }
        }
        this._shapeToolsService.setMode(null); // allow shape move events again
      });
    fromEvent(window.document as any, "mousemove", { capture: "true" } as any)
      .pipe(
        map((ev) => ({ dx: (ev as MouseEvent)?.movementX ?? 0, dy: (ev as MouseEvent)?.movementY ?? 0})),
        scan((acc, current) => ({ dx: acc.dx + current.dx, dy: acc.dy + current.dy }), { dx: 0, dy: 0 }),
        map(({ dx, dy }) => {
          const factor = 7; // TODO: adjust this based on zoom factor
          const target: Shape = this.updateShapeForShapesTool(initial, dx / factor, dy / factor) ?? initial;
          return { command: createShapeUpdateCommand(initial, target), dx: dx / factor, dy: dy / factor };
        }),
        filter(x => !!x?.command),
        tap(x => {
          lastCommand = x?.command;
          lastDx = x?.dx;
          lastDy = x?.dy;
        }),
        map(x => x?.command),
        filter(x => !!x),
        takeUntil(fromEvent(window.document as any, "mouseup", { capture: "true" } as any)),
      )
      .subscribe(command => {
        this._undoService.applyCommand(command, "forward");
      });
  }

  onShapeMouseDown = (initial: Shape, updater: (initial: Shape, update: { dx: number, dy: number }) => Shape) => {
    let cancelled: boolean = false; // TODO: 'esc' keyboard listener
    let lastCommand: UpdateShapeCommand | null = null;
    fromEvent(window.document as any, "mouseup", { capture: "true" } as any)
      .pipe(
        withLatestFrom(this._shapeToolsService.modeAsObservable),
        filter(([_, value]) => value === null),
        first()
      )
      .subscribe(() => {
        if (!lastCommand) return;
        if (cancelled) {
          this._undoService.applyCommand(lastCommand, 'reverse');
        } else {
          this._undoService.pushCommand(lastCommand);
        }
      });
    fromEvent(window.document as any, "mousemove", { capture: "true" } as any)
      .pipe(
        withLatestFrom(this._shapeToolsService.modeAsObservable),
        filter(([_, value]) => value === null),
        map(([ev]) => ({ dx: (ev as MouseEvent)?.movementX ?? 0, dy: (ev as MouseEvent)?.movementY ?? 0})),
        scan((acc, current) => ({ dx: acc.dx + current.dx, dy: acc.dy + current.dy }), { dx: 0, dy: 0 }),
        map(({ dx, dy }) => {
          const factor = 7; // TODO: adjust this based on zoom factor
          const target: Shape = updater(initial, { dx: dx / factor, dy: dy / factor });
          return createShapeUpdateCommand(initial, target);
        }),
        filter(x => !!x),
        tap(x => { lastCommand = x }),
        takeUntil(fromEvent(window.document as any, "mouseup", { capture: "true"} as any))
      )
      .subscribe(command => {
        this._undoService.applyCommand(command, "forward");
      });
  }

  onCircleMouseDown = (circle: Circle) => {
    this.onShapeMouseDown({ layerId: circle.layerId, circle, rectangle: null, textBox: null, polyline: null },
      (initial, update) => ({ ...initial, circle: { ...circle, centerX: circle.centerX + update.dx, centerY: circle.centerY + update.dy } }));
  }

  onRectangleMouseDown = (rectangle: Rectangle) => {
    this.onShapeMouseDown({ layerId: rectangle.layerId, circle: null, rectangle, textBox: null, polyline: null },
      (initial, update) => ({ ...initial, rectangle: { ...rectangle, x: rectangle.x + update.dx, y: rectangle.y + update.dy }}));
  }
}
