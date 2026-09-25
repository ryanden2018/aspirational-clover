import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from "../../app/theme.service";
import { DocumentService } from "../../app/document.service";
import { getDocumentUrl } from "../../util/getDocumentUrl";

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  styleUrls: ['./tab-bar.component.css'],
  templateUrl: './tab-bar.component.html',
  imports: [RouterLink]
})
export class TabBarComponent {
  tabBarTabActiveClassName = computed(() => this._themeService.classNames().tabBarTabActive);
  tabBarTabInactiveClassName = computed(() => this._themeService.classNames().tabBarTabInactive);
  documents = computed(() => this._documentService.documents());
  activeDocumentClientUuid = computed(() => this._documentService.activeDocumentClientUuid());

  constructor(private _themeService: ThemeService, private _documentService: DocumentService) {}

  getDocumentUrl = getDocumentUrl;
}
