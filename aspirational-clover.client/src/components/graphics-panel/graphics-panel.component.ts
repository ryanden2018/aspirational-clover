import { Component, computed } from '@angular/core';
import { filter, fromEvent, map, scan, takeUntil, first, tap, withLatestFrom } from 'rxjs';

import { Layer } from "../../data/model";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { ThemeService } from "../../app/theme.service";
import { ShapeToolsService } from "../../app/shape-tools.service";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { isPolygon } from "../../util/isPolygon";
import { Circle, Rectangle, Shape } from "../../data/shapes";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { UpdateShapeCommand, AddShapeCommand } from "../../data/commands";
import { newUuidV4 } from "../../util/uuid"; 
import { createAddShapeCommand } from '../../commands/addShape';

@Component({
  selector: 'app-graphics-panel',
  standalone: true,
  styleUrls: ['./graphics-panel.component.css'],
  templateUrl: './graphics-panel.component.html',
})
export class GraphicsPanelComponent {
  constructor(private _documentService: DocumentService, private _undoService: UndoService, private _shapeToolsService: ShapeToolsService, private _themeService: ThemeService) { }

  activeDocument = computed(() => this._documentService.activeDocument());

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

  onCircleClick = (circle: Circle) => console.log("circle: " + circle.clientUuid);

  onRectangleClick = (rectangle: Rectangle) => console.log("rectangle: " + rectangle.clientUuid);

  getInitialShape(event: MouseEvent): Shape | null {
    const mode = this._shapeToolsService.mode();

    // TODO: use current layer instead of default layer
    const layerId = this._documentService.activeDocument()?.layers?.[0]?.id;

    if (layerId === undefined) return null;

    const backgroundColor = this._themeService.mode() === "light" ? "#000000" : "#ffffff";

    switch (mode) {
      case 'rectangle':
        return { layerId, circle: null, textBox: null, polyline: null, rectangle: {
          x: event.clientX,
          y: event.clientY,
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
          centerX: event.clientX,
          centerY: event.clientY,
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

  updateShapeForShapesTool(shape: Shape, dx: number, dy: number) {
    // if (shape.circle) {
    //   return { ...shape, circle: { ...shape.circle, }}
    // }
  }

  onSvgMouseDown = (event: MouseEvent) => {
    // if (this._shapeToolsService.mode() === null) return;

    // const initial: Shape | null = this.getInitialShape(event);

    // if (!initial) return;

    // this._undoService.applyCommand(createAddShapeCommand())

    // let cancelled: boolean = false;
    // let lastCommand: AddShapeCommand | null = null;
    // fromEvent(window.document as any, "mouseup", { capture: "true" as any })
    //   .pipe(first())
    //   .subscribe(() => {
    //     if (!lastCommand) return;
    //     if (cancelled) {
    //       this._undoService.applyCommand(lastCommand, "reverse");
    //     } else {
    //       this._undoService.pushCommand(lastCommand);
    //     }
    //   });
    // fromEvent(window.document as any, "mousemove", { capture: "true" } as any)
    //   .pipe(
    //     map((ev) => ({ dx: (ev as MouseEvent)?.movementX ?? 0, dy: (ev as MouseEvent)?.movementY ?? 0})),
    //     scan((acc, current) => ({ dx: acc.dx + current.dx, dy: acc.dy + current.dy }), { dx: 0, dy: 0 }),
        
    //   )
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
          const factor = 5; // TODO: adjust this based on zoom factor
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
