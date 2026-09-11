export interface Layer {
  id: number;
  documentId: number;
  name: string;
  hidden: boolean;
  zIndex: number;
}

export interface AppDocument {
  id: number;
  documentSlug: string;
  createdAt: string;
  lastUpdatedAt: string;
  layers: Layer[];
}
