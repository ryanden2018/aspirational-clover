import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';

interface Layer {
  id: number;
  documentId: number;
  name: string;
  hidden: boolean;
  zIndex: number;
}

interface Document {
  id: number;
  documentSlug: string;
  createdAt: string;
  lastUpdatedAt: string;
  layers: Layer[];
}

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrls: ['./app.css'],
  templateUrl: './app.html',
})
export class App implements OnInit {
  // null = not loaded yet, [] = loaded but empty
  public documents: Document[] | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getDocuments();
  }

  getDocuments() {
    this.http.get<Document[]>('/document').subscribe(
      (result) => {
        console.log('document result', result);
        this.documents = result;
        // Ensure the UI updates if change detection did not run for some reason
        try { this.cdr.detectChanges(); } catch {}
      },
      (error) => {
        console.error(error);
        // mark as loaded but empty to show a helpful message in the UI
        this.documents = [];
      }
    );
  }

  protected readonly title = signal('aspirational-clover.client');
}
