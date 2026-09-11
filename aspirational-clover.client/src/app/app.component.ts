import { Component, OnInit, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentService } from './document.service';
import { AppDocument } from "../types";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule],
  styleUrls: ['./app.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // null = not loaded yet, [] = loaded but empty
  public documents: AppDocument[] | null = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => this.documents = docs,
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.documents = [];
      }
    })
  }

  protected readonly title = signal('aspirational-clover.client');
}
