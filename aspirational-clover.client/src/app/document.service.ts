import { Injectable, signal, inject, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, filter, first, map } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDocument } from "../data/model";
import { getDocumentSlugFromUrl } from "../util/getDocumentSlugFromUrl";

@Injectable({
  providedIn: "root"
})
export class DocumentService {
  documents = signal<AppDocument[]>([]);

  private _apiDocumentUrl = "/document"; // TODO: should be /api/document and move to constants.ts

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
    return this.http.get<AppDocument[]>(this._apiDocumentUrl);
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
}
