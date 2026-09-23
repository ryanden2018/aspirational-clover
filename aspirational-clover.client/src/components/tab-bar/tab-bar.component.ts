import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppDocument } from "../../data/model";
import { ThemeService } from "../../app/theme.service";
import { getDocumentUrl } from "../../util/getDocumentUrl";

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  styleUrls: ['./tab-bar.component.css'],
  templateUrl: './tab-bar.component.html',
  imports: [RouterLink]
})
export class TabBarComponent {
  documents = input<AppDocument[]>([]);
  activeDocumentClientUuid = input<string>("");

  tabBarTabActiveClassName = computed(() => this._themeService.classNames().tabBarTabActive);
  tabBarTabInactiveClassName = computed(() => this._themeService.classNames().tabBarTabInactive);

  constructor(private _themeService: ThemeService) {}

  getDocumentUrl = getDocumentUrl;
}
