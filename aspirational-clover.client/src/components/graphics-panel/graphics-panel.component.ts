import { Component, computed } from '@angular/core';
import { filter, fromEvent, map, scan, takeUntil, first, tap } from 'rxjs';

import { Layer } from "../../data/model";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { isPolygon } from "../../util/isPolygon";
import { Circle, Rectangle, Shape } from "../../data/shapes";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { UpdateShapeCommand } from "../../data/commands";

@Component({
  selector: 'app-graphics-panel',
  standalone: true,
  styleUrls: ['./graphics-panel.component.css'],
  templateUrl: './graphics-panel.component.html',
})
export class GraphicsPanelComponent {
  constructor(private _documentService: DocumentService, private _undoService: UndoService) { }

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

  onCircleMouseDown = (circle: Circle) => {
    const initial: Shape = { layerId: circle.layerId, circle, rectangle: null, textBox: null, polyline: null };
    let cancelled: boolean = false; // TODO: 'esc' keyboard listener
    let lastCommand: UpdateShapeCommand | null = null;
    fromEvent(window.document as any, "mouseup", { capture: "true" } as any)
      .pipe(first())
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
        map(ev => ({ dx: (ev as MouseEvent)?.movementX ?? 0, dy: (ev as MouseEvent)?.movementY ?? 0})),
        scan((acc, current) => ({ dx: acc.dx + current.dx, dy: acc.dy + current.dy }), { dx: 0, dy: 0 }),
        map(({ dx, dy }) => {
          const factor = 5; // TODO: adjust this based on zoom factor
          const target: Shape = { ...initial, circle: { ...circle, centerX: circle.centerX + dx / factor, centerY: circle.centerY + dy / factor } };
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
}
