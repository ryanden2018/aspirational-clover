import { Component, OnInit, signal, viewChild, computed } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToolBarComponent } from "../components/tool-bar/tool-bar.component";
import { PropertyViewerComponent } from "../components/property-viewer/property-viewer.component";
import { TabBarComponent } from '../components/tab-bar/tab-bar.component';
import { SaveModalComponent } from '../components/save-modal/save-modal.component';
import { ResourcesComponent } from "../components/resources/resources.component";
import { AnchoredToolTipComponent } from "../components/anchored-tool-tip/anchored-tool-tip.component";
import { GraphicsPanelComponent } from "../components/graphics-panel/graphics-panel.component";
import { DocumentService } from './document.service';
import { ResourcesService } from "./resources.service";
import { HotkeysService } from "./hotkeys.service";
import { ThemeService } from "./theme.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    ToolBarComponent,
    PropertyViewerComponent,
    TabBarComponent,
    GraphicsPanelComponent,
    ResourcesComponent,
    AnchoredToolTipComponent,
    SaveModalComponent,
  ],
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private _resources = viewChild<ResourcesComponent>(ResourcesComponent);

  appToolBarClassName = computed(() => this._themeService.classNames().toolBar);
  appPropertyViewerClassName = computed(() => this._themeService.classNames().propertyViewer);
  appTabBarClassName = computed(() => this._themeService.classNames().tabBar);
  appBodyClassName = computed(() => this._themeService.classNames().appBody);

  constructor(
    private _documentService: DocumentService,
    private _resourcesService: ResourcesService,
    private _themeService: ThemeService,
    private _hotkeysService: HotkeysService,
  ) {
    // Subscribe icons etc so we only need to import the template once.
    // DO NOT place this line in ngOnInit(), it will throw a runtime eror (NG0203).
    this._resourcesService.subscribeResources(this._resources);
  }

  ngOnInit() {
    this._documentService.retrieveSampleDocumentsOnce();
    this._hotkeysService.connectDeleteKeydown();
    this._hotkeysService.connectCtrlZKeydown();
    this._hotkeysService.connectCtrlYKeydown();
    this._hotkeysService.connectCtrlShiftZKeydown();
    this._hotkeysService.connectCtrlCKeydown();
    this._hotkeysService.connectCtrlVKeydown();
  }

  protected readonly title = signal('aspirational-clover.client');
}
