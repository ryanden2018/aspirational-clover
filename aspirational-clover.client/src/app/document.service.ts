import { Injectable, signal, inject, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, filter, first, map } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDocument } from "../data/model";
import { getDocumentSlugFromUrl } from "../util/getDocumentSlugFromUrl";
import { newUuidV4 } from "../util/uuid";
import { getDocumentUrl } from "../util/getDocumentUrl";
import { defaultSlugs, apiDocumentUrl } from "../constants";

@Injectable({
  providedIn: "root"
})
export class DocumentService {
  documents = signal<AppDocument[]>(defaultSlugs.map(documentSlug => ({
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
      name: "layer-0",
      hidden: false,
      zIndex: 0,
      shapes: [],
    }],
  })));

  private _newDocumentCount = signal<number>(1);

  currentUrl = signal<string>("");

  private _router = inject(Router);

  activeDocument = computed(() => this.documents()?.find(d => d.clientUuid === this.activeDocumentClientUuid()) ?? null);

  activeDocumentClientUuid = computed(() => {
    const slug = getDocumentSlugFromUrl(this.currentUrl() ?? "");
    if (typeof slug === "string" && slug.length > 0) {
      const document = this.documents().find(d => d?.documentSlug === slug);
      if (document) {
        return document.clientUuid;;
      }
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
    });
  }

  getDocuments(): Observable<AppDocument[]> {
    return this.http.get<AppDocument[]>(apiDocumentUrl);
  }

  retrieveDocumentsOnce() {
    this.getDocuments().pipe(
      filter(x => x && x.length > 0),
      first(),
    ).subscribe({
      next: (docs) => {
        this.documents.set(docs);
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.documents.set([]);
      }
    });
  }

  updateDocumentInMemory(updatedDocument: AppDocument) {
    this.documents.set(
      this.documents().map(doc => (doc.clientUuid === updatedDocument.clientUuid) ? updatedDocument : doc)
    );
  }

  setActiveDocumentName(name: string) {
    this.documents.set(
      this.documents().map(doc => (doc.clientUuid === this.activeDocument()?.clientUuid) ? ({ ...doc, name }) : doc)
    );
  }

  newDocument() {
    const newDocument: AppDocument = {
      id: 0,
      clientUuid: newUuidV4(),
      documentSlug: newUuidV4(),
      name: `New Document ${this._newDocumentCount()}`,
      createdAt: "",
      lastUpdatedAt: "",
      layers: [{
        id: 0,
        clientUuid: newUuidV4(),
        documentId: 0,
        name: "Layer 0",
        hidden: false,
        zIndex: 0,
        shapes: []
      }]
    }
    this.documents.set([...this.documents(), newDocument]);
    this._newDocumentCount.set(this._newDocumentCount() + 1)
    this._router.navigateByUrl(getDocumentUrl(newDocument));
  }

  closeDocument(clientUuid: string) {
    const isActiveDocument = (this.activeDocument()?.clientUuid === clientUuid);
    this.documents.set(this.documents().filter(document => document.clientUuid !== clientUuid));
    if (isActiveDocument) {
      this._router.navigateByUrl(getDocumentUrl(this.documents()[0]));
    }
  }
}
