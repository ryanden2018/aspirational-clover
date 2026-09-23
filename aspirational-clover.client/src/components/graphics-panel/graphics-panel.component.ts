import { Component, input, computed } from '@angular/core';

import { AppDocument, Layer } from "../../data/model";
import { Transformable, Layerable, Fillable } from "../../data/interfaces";
import { isPolygon } from "../../util/isPolygon";

@Component({
  selector: 'app-graphics-panel',
  standalone: true,
  styleUrls: ['./graphics-panel.component.css'],
  templateUrl: './graphics-panel.component.html',
})
export class GraphicsPanelComponent {
  document = input<AppDocument | null>(null);

  sortedLayers = computed(() =>
    [...(this.document()?.layers?.filter(layer => !layer?.hidden) ?? [])]
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
  getTransform = (entity: Transformable) => `rotate(${ entity?.rotationAngle }) skewX(${ entity?.skewX }) skewY(${ entity?.skewY })`
}
