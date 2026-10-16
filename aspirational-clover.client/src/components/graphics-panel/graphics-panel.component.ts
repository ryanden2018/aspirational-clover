import { Component, computed, OnInit } from '@angular/core';

import { DocumentService } from "../../app/document.service";
import { SelectionService } from "../../app/selection.service";
import { ThemeService } from "../../app/theme.service";
import { ShapeToolsService } from "../../app/shape-tools.service";
import { GraphicsService } from "../../app/graphics.service";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { Circle, Rectangle, TextBox } from "../../data/shapes";
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
    private _shapeToolsService: ShapeToolsService,
    private _selectionService: SelectionService,
    private _themeService: ThemeService,
    private _graphicsService: GraphicsService,
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

  onSvgMouseDown = (event: MouseEvent) => {
    if (!event.target) return;
    this._graphicsService.pushEvent({
      type: "down",
      event,
    });
  }

  onSvgMouseMove = (event: MouseEvent) => {
    if (!event.target) return;
    this._graphicsService.pushEvent({
      type: "move",
      event,
    });
  }

  onCircleMouseDown = (event: MouseEvent, circle: Circle) => {
    event.stopPropagation();
    this._graphicsService.pushEvent({
      type: "down",
      shape: { layerId: circle.layerId, circle, rectangle: null, textBox: null, polyline: null },
      event,
      updater: (initial, update) => ({ ...initial, circle: { ...circle, centerX: truncateFloat(circle.centerX + update.dx, 0), centerY: truncateFloat(circle.centerY + update.dy, 0) } })
    });
  }

  onRectangleMouseDown = (event: MouseEvent, rectangle: Rectangle) => {
    event.stopPropagation();
    this._graphicsService.pushEvent({
      type: "down",
      shape: { layerId: rectangle.layerId, circle: null, rectangle, textBox: null, polyline: null },
      event,
      updater: (initial, update) => ({ ...initial, rectangle: { ...rectangle, x: truncateFloat(rectangle.x + update.dx, 0), y: truncateFloat(rectangle.y + update.dy, 0) }})
    });
  }

  onTextBoxMouseDown = (event: MouseEvent, textBox: TextBox) => {
    event.stopPropagation();
    this._graphicsService.pushEvent({
      type: "down",
      shape: { layerId: textBox.layerId, circle: null, rectangle: null, textBox, polyline: null},
      event,
      updater: (initial, update) => ({ ...initial, textBox: { ...textBox, x: truncateFloat(textBox.x + update.dx, 0), y: truncateFloat(textBox.y + update.dy, 0) }})
    });
  }
}
