import { Injectable, signal, inject, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, filter, first, map } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDocument, Layer } from "../data/model";
import { getDocumentSlugFromUrl } from "../util/getDocumentSlugFromUrl";
import { newUuidV4 } from "../util/uuid";
import { getDocumentUrl } from "../util/getDocumentUrl";
import { getToken } from "../util/getToken";
import { defaultSlugs, apiDocumentSamplesUrl, apiDocumentUrl, apiDocumentSlugUrl } from "../constants";
import { ToastSignal } from "../types";

@Injectable({
  providedIn: "root"
})
export class DocumentService {
  private _documents = signal<AppDocument[]>(defaultSlugs.map(documentSlug => ({
    id: 0,
    clientUuid: newUuidV4(),
    documentSlug,
    name: documentSlug,
    createdAt: "",
    lastUpdatedAt: "",
    layers: [{
      id: 0,
      clientUuid: newUuidV4(),
      documentId: 0,
      name: "Layer 1",
      hidden: false,
      zIndex: 0,
      shapes: [],
    }],
  })));

  documents = this._documents.asReadonly();

  private _newDocumentCount = signal<number>(1);

  private _selectedLayerClientUuidByDocumentClientUuid = signal<Record<string, string>>({});

  private _saveModalOpen = signal<boolean>(false);

  saveModalOpen = this._saveModalOpen.asReadonly();

  private _toast = signal<ToastSignal>(null);

  toast = this._toast.asReadonly();

  closeToast = () => this._toast.set(null);

  setSelectedLayer(documentClientUuid: string, layerClientUuid: string): void {
    if (!documentClientUuid || !layerClientUuid) return;
    const value = this._selectedLayerClientUuidByDocumentClientUuid();
    const newValue = { ...(value ?? {}), [documentClientUuid]: layerClientUuid };
    this._selectedLayerClientUuidByDocumentClientUuid.set(newValue);
  }

  selectedLayer = computed(() => {
    const layerClientUuid = (this._selectedLayerClientUuidByDocumentClientUuid() ?? {})[this.activeDocumentClientUuid()];
    const layers = this.activeDocument()?.layers ?? [];
    const layer = layers.find(l => l.clientUuid === layerClientUuid);
    if (layer) return layer;
    const maxZIndex = Math.max(0, ...layers.map(l => l.zIndex));
    if (typeof maxZIndex === "number") {
      return layers.find(l => l.zIndex === maxZIndex) ?? layers[0] ?? null;
    }
    return (layers[0] ?? null) as (Layer | null);
  });

  currentUrl = signal<string>("");

  private _router = inject(Router);

  activeDocument = computed(() => this.documents()?.find(d => d.clientUuid === this.activeDocumentClientUuid()) ?? null);

  activeDocumentClientUuid = computed(() => {
    const slug = Boolean(this.currentUrl()) ? getDocumentSlugFromUrl(this.currentUrl() ?? "") : getDocumentSlugFromUrl(window.location?.href ?? "");
    if (typeof slug === "string" && slug.length > 0) {
      const document = this.documents().find(d => d?.documentSlug === slug);
      if (document) {
        return document.clientUuid;
      }
      return "";
    }
    return this.documents()[0]?.clientUuid ?? "";
  });

  constructor(private http: HttpClient) {
    this._router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url),
      takeUntilDestroyed()
    ).subscribe(url => {
      this.currentUrl.set(url);
      const slug = getDocumentSlugFromUrl(url);
      if (slug && !this.documents().find(d => d.documentSlug === slug) && !defaultSlugs.includes(slug)) {
        this._documents.set([...(this.documents() ?? []), {
          id: 0,
          clientUuid: newUuidV4(),
          documentSlug: slug,
          name: "",
          createdAt: "",
          lastUpdatedAt: "",
          layers: [{
            id: 0,
            clientUuid: newUuidV4(),
            documentId: 0,
            name: "Layer 1",
            hidden: false,
            zIndex: 0,
            shapes: [],
          }],
        }]);
        this.retrieveDocumentBySlug(slug);
      }
    });
  }

  getSampleDocuments(): Observable<AppDocument[]> {
    return this.http.get<AppDocument[]>(apiDocumentSamplesUrl);
  }

  retrieveSampleDocumentsOnce() {
    this.getSampleDocuments().pipe(
      filter(x => x && x.length > 0),
      first(),
    ).subscribe({
      next: (docs) => {
        const docsMap = new Map(docs.map(doc => [doc.documentSlug, doc]));
        const existingDocs = this.documents() ?? [];
        const newDocs = existingDocs.map(doc => docsMap.get(doc.documentSlug) ?? doc);
        this._documents.set(newDocs);
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      }
    });
  }

  retrieveDocumentBySlug(slug: string): Promise<string> {
    return new Promise<string>(resolve => {
      this.http.get<AppDocument>(`${apiDocumentSlugUrl}/${slug}`).pipe(
        filter(x => x?.documentSlug === slug),
        first()
      ).subscribe({
        next: (doc) => {
          const currentDocuments = this.documents() ?? [];
          if (!currentDocuments.find(d => d.documentSlug === slug)) {
            this._documents.set([...currentDocuments, doc]);
          } else {
            const newDocuments = currentDocuments.map(d => d.documentSlug === slug ? doc : d);
            this._documents.set(newDocuments);
          }
          resolve(slug);
        },
        error: (err) => {
          console.error('Error fetching document by slug:', err);
        }
      });
    });
  }

  updateDocumentInMemory(updatedDocument: AppDocument) {
    this._documents.set(
      this.documents().map(doc => (doc.clientUuid === updatedDocument.clientUuid) ? updatedDocument : doc)
    );
  }

  newDocument() {
    const newDocument: AppDocument = {
      id: 0,
      clientUuid: newUuidV4(),
      documentSlug: newUuidV4(),
      name: `New Document ${this._newDocumentCount()}`,
      createdAt: null,
      lastUpdatedAt: null,
      layers: [{
        id: 0,
        clientUuid: newUuidV4(),
        documentId: 0,
        name: "Layer 1",
        hidden: false,
        zIndex: 0,
        shapes: []
      }]
    }
    this._documents.set([...this.documents(), newDocument]);
    this._newDocumentCount.set(this._newDocumentCount() + 1)
    this._router.navigateByUrl(getDocumentUrl(newDocument));
  }

  closeDocument(clientUuid: string) {
    const isActiveDocument = (this.activeDocument()?.clientUuid === clientUuid);
    this._documents.set(this.documents().filter(document => document.clientUuid !== clientUuid));
    if (isActiveDocument) {
      this._router.navigateByUrl(getDocumentUrl(this.documents()[0]));
    }
  }

  allowSave() {
    if (!this.activeDocument()?.documentSlug) return false;
    return !defaultSlugs.includes(this.activeDocument()?.documentSlug ?? "");
  }

  saveDocument(finalize?: () => void) {
    const documentToSave = this.activeDocument();
    const slug = documentToSave?.documentSlug;
    if (!slug || !documentToSave) return;
    if (defaultSlugs.includes(slug)) return;
    const method = documentToSave?.id === 0 ? "POST" : "PUT";
    const url = documentToSave?.id === 0 ? apiDocumentUrl : `${apiDocumentUrl}/${documentToSave.id}`;
    getToken().then(async (token: string) => {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": `${token}`
        },
        body: JSON.stringify(documentToSave)
      });
    }).then(async () => {
      await this.retrieveDocumentBySlug(slug);
    }).then(() => {
      this._toast.set({ type: "success", value: "Saved successfully." });
      setTimeout(() => {
        this._toast.set(null);
      }, 5000);
    }).catch(() => {
      this._toast.set({ type: "error", value: "Save failed." });
      setTimeout(() => {
        this._toast.set(null);
      }, 5000);
    })
    .finally(() => {
      finalize?.();
    })
  }

  onSave(finalize?: () => void) {
    if (!this.allowSave()) return;

    const id = this.activeDocument()?.id;

    if (typeof id !== "number") return;

    if (id === 0) {
      this._saveModalOpen.set(true);
    } else {
      this.saveDocument(finalize);
    }
  }

  closeSaveModal() {
    this._saveModalOpen.set(false);
  }
}
