import { Component, computed } from '@angular/core';
import { NgTemplateOutlet } from "@angular/common";
import { RouterLink } from '@angular/router';

import { AppDocument } from "../../data/model";
import { ThemeService } from "../../app/theme.service";
import { DocumentService } from "../../app/document.service";
import { SelectionService } from "../../app/selection.service";
import { ResourcesService } from "../../app/resources.service";
import { getDocumentUrl } from "../../util/getDocumentUrl";
import { ToolTipButtonComponent } from "../tool-tip-button/tool-tip-button.component";

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  styleUrls: ['./tab-bar.component.css'],
  templateUrl: './tab-bar.component.html',
  imports: [RouterLink, ToolTipButtonComponent, NgTemplateOutlet]
})
export class TabBarComponent {
  tabBarTabActiveClassName = computed(() => this._themeService.classNames().tabBarTabActive);
  tabBarTabInactiveClassName = computed(() => this._themeService.classNames().tabBarTabInactive);
  documents = computed(() => this._documentService.documents());
  activeDocumentClientUuid = computed(() => this._documentService.activeDocumentClientUuid());

  constructor(
    private _themeService: ThemeService,
    private _documentService: DocumentService,
    private _selectionService: SelectionService,
    private _resourcesService: ResourcesService,
  ) {}

  closeIcon = computed(() => this._resourcesService.resources()?.closeIcon?.());

  getDocumentUrl = getDocumentUrl;

  onTabClick() {
    this._selectionService.setSelectedShapeClientUuid(null);
  }

  onMouseDownClose(event: MouseEvent, document: AppDocument) {
    event.stopPropagation();
    this._documentService.closeDocument(document.clientUuid);
  }
}
