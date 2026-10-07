import { Component, computed, OnInit } from '@angular/core';
import { filter, fromEvent, map, scan, takeUntil, first, tap, withLatestFrom } from 'rxjs';

import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { SelectionService } from "../../app/selection.service";
import { ThemeService } from "../../app/theme.service";
import { ShapeToolsService } from "../../app/shape-tools.service";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { Circle, Rectangle, Shape, TextBox } from "../../data/shapes";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { UpdateShapeCommand } from "../../data/commands";
import { newUuidV4 } from "../../util/uuid"; 
import { createAddShapeCommand } from '../../commands/addShape';
import { getClientUuidFromShape } from '../../util/getClientUuidFromShape';
import { parseTextBoxContent } from "../../util/textUtils";
import { truncateFloat } from "../../util/truncateFloat";

@Component({
  selector: 'app-graphics-panel',
  standalone: true,
  styleUrls: ['./graphics-panel.component.css'],
  templateUrl: './graphics-panel.component.html',
})
export class GraphicsPanelComponent implements OnInit {
  constructor(
    private _documentService: DocumentService,
    private _undoService: UndoService,
    private _shapeToolsService: ShapeToolsService,
    private _selectionService: SelectionService,
    private _themeService: ThemeService,
  ) { }

  ngOnInit() {
    this._themeService.modeAsObservable.subscribe(mode => {
      const backgroundColor = (mode === "light") ? "var(--light-background)" : "var(--dark-background)";
      (document.querySelector("app-graphics-panel") as HTMLDivElement)?.style?.setProperty("background-color", backgroundColor);
    });
  }

  activeDocument = computed(() => this._documentService.activeDocument());

  selectedShapeClientUuid = computed(() => this._selectionService.selectedShapeClientUuid());

  selectionOutlineColor = computed(() => this._themeService.mode() === "dark" ? "#ffffff" : "#000000");

  textBoxColor = computed(() => this._themeService.mode() === "dark" ? "#ffffff" : "#000000");

  graphicsPanelSvgClassName = computed(() => this._themeService.classNames().graphicsPanelSvg + " " + (
    this._shapeToolsService.mode() === null ? "" : "cursor-crosshair"
  ));

  isCreatingShape = computed(() => this._shapeToolsService.mode() !== null);

  sortedLayers = computed(() =>
    [...(this.activeDocument()?.layers?.filter(layer => !layer?.hidden) ?? [])]
    .sort((a,b) => a?.zIndex - b?.zIndex));

  getClientUuidFromShape = getClientUuidFromShape;

  getGradientId = (entity: Layerable) => `lg-${ entity?.clientUuid }`;
  getGradientFillAttr = (entity: Layerable) => `url(#${ this.getGradientId(entity) })`;

  getFillX1 = (entity: Fillable) => `${ 0.5 - (Math.cos(Math.PI * (entity?.fillAngle ?? 0) / 180) / 2) }`;
  getFillY1 = (entity: Fillable) => `${ 0.5 - (Math.sin(Math.PI * (entity?.fillAngle ?? 0) / 180) / 2) }`; 
  getFillX2 = (entity: Fillable) => `${ 0.5 + (Math.cos(Math.PI * (entity?.fillAngle ?? 0) / 180) / 2) }`;
  getFillY2 = (entity: Fillable) => `${ 0.5 + (Math.sin(Math.PI * (entity?.fillAngle ?? 0) / 180) / 2) }`;

  getTransformOriginCircle = (entity: Circle) => `${ entity?.radius + entity?.rotationCenterOffsetX }px ${ entity?.radius + entity?.rotationCenterOffsetY }px`;
  getTransformOriginRectangle = (entity: Rectangle) => `${ (entity?.width / 2) + entity?.rotationCenterOffsetX }px ${ (entity?.height / 2) + entity?.rotationCenterOffsetY }px`;
  getTransform = (entity: Transformable) => `rotate(${ entity?.rotationAngle }) skewX(${ entity?.skewX }) skewY(${ entity?.skewY })`;

  getTextBoxText = (textBox: TextBox) => parseTextBoxContent(textBox);

  onCircleClick = (event: MouseEvent, circle: Circle) => {
    event.stopPropagation();
    this._selectionService.setSelectedShapeClientUuid(circle.clientUuid);
  }

  onRectangleClick = (event: MouseEvent, rectangle: Rectangle) => {
    event.stopPropagation();
    this._selectionService.setSelectedShapeClientUuid(rectangle.clientUuid);
  }

  onTextBoxClick = (event: MouseEvent, textBox: TextBox) => {
    event.stopPropagation();
    this._selectionService.setSelectedShapeClientUuid(textBox.clientUuid);
  }

  onSvgClick = () => {
    this._selectionService.setSelectedShapeClientUuid(null);
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

  onSvgMouseDown = (event: MouseEvent) => {
    if (!event.target) return;
    const mode = this._shapeToolsService.mode();
    if (mode === null) return;
    const isClickOnlyEvent = this._shapeToolsService.mode() === "textbox" || this._shapeToolsService.mode() === "polyline";
    this._shapeToolsService.setMode(null);

    const initial: Shape | null = this.getInitialShape(event, mode);

    if (!initial) return;

    const offsetX = event.offsetX;
    const offsetY = event.offsetY;

    const selectedLayer = this._documentService.selectedLayer();
    const selectedLayerClientUuid = selectedLayer?.clientUuid;
    
    if (!selectedLayerClientUuid) return;

    const addShapeCommand = createAddShapeCommand(selectedLayerClientUuid, initial);

    if (!addShapeCommand) return;
    this._undoService.applyCommand(addShapeCommand, "forward");

    if (isClickOnlyEvent) {
      this._undoService.pushCommand(addShapeCommand); // if we need to track mouse movements, push comes LATER
      return;
    }

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
          const shapeClientUuid = getClientUuidFromShape(addShapeCommand.payload.forward);
          if (shapeClientUuid) {
            // the svg click handler will automatically deselect so we need to wait an interval before reselecting
            setTimeout(() => {
              this._selectionService.setSelectedShapeClientUuid(shapeClientUuid);
            }, 10);
          }
        }
      });
    fromEvent(event.target, "mousemove", { capture: "true" } as any)
      .pipe(
        map((ev) => {
          const myOffsetX = (ev as MouseEvent)?.offsetX;
          const myOffsetY = (ev as MouseEvent)?.offsetY;
          if (typeof myOffsetX === "number" && myOffsetX > 0 && typeof myOffsetY === "number" && myOffsetY > 0) {
            return { dx: myOffsetX - offsetX, dy: myOffsetY - offsetY };
          }
          return { dx: 0, dy: 0 };
        }),
        map(({ dx, dy }) => {
          const target: Shape = this.updateShapeForShapesTool(initial, dx, dy) ?? initial;
          return { command: createShapeUpdateCommand(initial, target), dx, dy };
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

  onShapeMouseDown = (event: MouseEvent, initial: Shape, updater: (initial: Shape, update: { dx: number, dy: number }) => Shape) => {
    if (!event.target) return;
    if (this._shapeToolsService.mode() !== null) return; // don't allow moving shapes while creating new shapes
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    let cancelled: boolean = false; // TODO: 'esc' keyboard listener
    let lastCommand: UpdateShapeCommand | null = null;
    this._selectionService.setSelectedShapeClientUuid(getClientUuidFromShape(initial) ?? null);
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
    fromEvent(event.target, "mousemove", { capture: "true" } as any)
      .pipe(
        withLatestFrom(this._shapeToolsService.modeAsObservable),
        filter(([_, value]) => value === null),
        map(([ev]) => {
          const myOffsetX = (ev as MouseEvent)?.offsetX;
          const myOffsetY = (ev as MouseEvent)?.offsetY;
          if (typeof myOffsetX === "number" && myOffsetX > 0 && typeof myOffsetY === "number" && myOffsetY > 0) {
            return { dx: myOffsetX - offsetX, dy: myOffsetY - offsetY };
          }
          return { dx: 0, dy: 0 };
        }),
        map(({ dx, dy }) => {
          const target: Shape = updater(initial, { dx, dy });
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

  onCircleMouseDown = (event: MouseEvent, circle: Circle) => {
    this.onShapeMouseDown(event, { layerId: circle.layerId, circle, rectangle: null, textBox: null, polyline: null },
      (initial, update) => ({ ...initial, circle: { ...circle, centerX: truncateFloat(circle.centerX + update.dx, 0), centerY: truncateFloat(circle.centerY + update.dy, 0) } }));
  }

  onRectangleMouseDown = (event: MouseEvent, rectangle: Rectangle) => {
    this.onShapeMouseDown(event, { layerId: rectangle.layerId, circle: null, rectangle, textBox: null, polyline: null },
      (initial, update) => ({ ...initial, rectangle: { ...rectangle, x: truncateFloat(rectangle.x + update.dx, 0), y: truncateFloat(rectangle.y + update.dy, 0) }}));
  }

  onTextBoxMouseDown = (event: MouseEvent, textBox: TextBox) => {
    this.onShapeMouseDown(event, { layerId: textBox.layerId, circle: null, rectangle: null, textBox, polyline: null},
      (initial, update) => ({ ...initial, textBox: { ...textBox, x: truncateFloat(textBox.x + update.dx, 0), y: truncateFloat(textBox.y + update.dy, 0) }}));
  }
}
