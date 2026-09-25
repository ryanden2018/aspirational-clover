import { Component, OnInit, signal, viewChild, computed, inject } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  private _resources = viewChild<ResourcesComponent>(ResourcesComponent);

  appToolBarClassName = computed(() => this._themeService.classNames().toolBar);
  appTabBarClassName = computed(() => this._themeService.classNames().tabBar);
  appBodyClassName = computed(() => this._themeService.classNames().appBody);

  constructor(private _documentService: DocumentService, private _resourcesService: ResourcesService, private _themeService: ThemeService) {
    // Subscribe icons etc so we only need to import the template once.
    // DO NOT place this line in ngOnInit(), it will throw a runtime eror (NG0203).
    this._resourcesService.subscribeResources(this._resources);
  }

  ngOnInit() {
    this._documentService.retrieveDocumentsOnce();
  }

  protected readonly title = signal('aspirational-clover.client');
}
