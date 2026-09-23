import { Component, OnInit, signal, viewChild, computed, inject } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from "@angular/router";
import { CommonModule } from '@angular/common';
import { filter, map } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDocument } from "../data/model";
import { ToolBarComponent } from "../components/tool-bar/tool-bar.component";
import { TabBarComponent } from '../components/tab-bar/tab-bar.component';
import { ResourcesComponent } from "../components/resources/resources.component";
import { AnchoredToolTipComponent } from "../components/anchored-tool-tip/anchored-tool-tip.component";
import { GraphicsPanelComponent } from "../components/graphics-panel/graphics-panel.component";
import { DocumentService } from './document.service';
import { ResourcesService } from "./resources.service";
import { ThemeService } from "./theme.service";
import { getDocumentSlugFromUrl } from '../util/getDocumentSlugFromUrl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    ToolBarComponent,
    TabBarComponent,
    GraphicsPanelComponent,
    ResourcesComponent,
    AnchoredToolTipComponent,
  ],
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  documents = signal<AppDocument[]>([]);
  currentUrl = signal<string>("");

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

  private _resources = viewChild<ResourcesComponent>(ResourcesComponent);

  private _router = inject(Router);

  appToolBarClassName = computed(() => this._themeService.classNames().toolBar);
  appTabBarClassName = computed(() => this._themeService.classNames().tabBar);
  appBodyClassName = computed(() => this._themeService.classNames().appBody);

  activeDocument = computed(() => this.documents()?.find(d => d.clientUuid === this.activeDocumentClientUuid()) ?? null);

  constructor(private _documentService: DocumentService, private _resourcesService: ResourcesService, private _themeService: ThemeService) {
    // Subscribe icons etc so we only need to import the template once.
    // DO NOT place this line in ngOnInit(), it will throw a runtime eror (NG0203).
    this._resourcesService.subscribeResources(this._resources);

    this._router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url),
      takeUntilDestroyed()
    ).subscribe(url => {
      this.currentUrl.set(url);
    });
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
