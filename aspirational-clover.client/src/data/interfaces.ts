export interface Layerable {
  id: number;
  clientUuid: string;
  layerId: number;
}

export interface Fillable {
  fillColorFrom: string;
  fillColorTo: string;
  fillAngle: number;
}

export interface Transformable {
  rotationAngle: number;
  rotationCenterOffsetX: number;
  rotationCenterOffsetY: number;
  skewX: number;
  skewY: number;
}
