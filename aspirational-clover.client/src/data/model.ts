import { Shape } from "./shapes";

export interface Layer {
  id: number;
  documentId: number;
  name: string;
  hidden: boolean;
  zIndex: number;
  shapes: Shape[];
}

export interface AppDocument {
  id: number;
  documentSlug: string;
  name: string;
  createdAt: string;
  lastUpdatedAt: string;
  layers: Layer[];
}
