import { Shape } from "./shapes";

export interface Layer {
  id: number;
  clientUuid: string;
  documentId: number;
  name: string;
  hidden: boolean;
  zIndex: number;
  shapes: Shape[];
}

export interface AppDocument {
  id: number;
  clientUuid: string;
  documentSlug: string;
  name: string;
  createdAt: string;
  lastUpdatedAt: string;
  layers: Layer[];
}
