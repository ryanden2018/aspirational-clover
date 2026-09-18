import { Component, OnInit, signal, viewChild, computed } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocumentService } from './document.service';
import { AppDocument } from "../types";
import { ToolBarComponent } from "../components/tool-bar/tool-bar.component";
import { ResourcesComponent } from "../components/resources/resources.component";
import { AnchoredToolTipComponent } from "../components/anchored-tool-tip/anchored-tool-tip.component";
import { ResourcesService } from "./resources.service";
import { ThemeService } from "./theme.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    ToolBarComponent,
    ResourcesComponent,
    AnchoredToolTipComponent,
  ],
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public documents = signal<AppDocument[]>([]);
  private _resources = viewChild<ResourcesComponent>(ResourcesComponent);

  appToolBarClassName = computed(() => this._themeService.classNames().toolBar);

  constructor(private _documentService: DocumentService, private _resourcesService: ResourcesService, private _themeService: ThemeService) {
    // Subscribe icons etc so we only need to import the template once.
    // DO NOT place this line in ngOnInit(), it will throw a runtime eror (NG0203).
    this._resourcesService.subscribeResources(this._resources);
  }

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
