import { Fillable, Layerable, Transformable } from "./interfaces";

export interface Coord {
  x: number;
  y: number;
}

export interface Rectangle extends Fillable, Layerable, Transformable {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle extends Fillable, Layerable, Transformable {
  centerX: number;
  centerY: number;
  radius: number;
}

export interface Polyline extends Fillable, Layerable {
  coords: string;
}

export interface TextBox extends Layerable {
  content: string;
}

export interface Shape {
  circle: Circle | null;
  rectangle: Rectangle | null;
  textBox: TextBox | null;
  polyline: Polyline | null;
  layerId: number;
}

export interface ShapeUpdate {
  circle?: Omit<Partial<Circle>, "id" | "clientUuid" | "layerId"> | null;
  rectangle?: Omit<Partial<Rectangle>, "id" | "clientUuid" | "layerId"> | null;
  textBox?: Omit<Partial<TextBox>, "id" | "clientUuid" | "layerId"> | null;
  polyline?: Omit<Partial<Polyline>, "id" | "clientUuid" | "layerId"> | null;
}
