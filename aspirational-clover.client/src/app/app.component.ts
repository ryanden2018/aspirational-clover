import { Component, OnInit, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocumentService } from './document.service';
import { AppDocument } from "../types";
import { ToolBarComponent } from "../components/tool-bar/tool-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    ToolBarComponent
  ],
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public documents = signal<AppDocument[]>([]);

  constructor(private _documentService: DocumentService) {}

  ngOnInit() {
    this._documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.documents.set([]);
      }
    });
  }

  protected readonly title = signal('aspirational-clover.client');
}
