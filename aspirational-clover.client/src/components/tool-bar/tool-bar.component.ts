import { Component, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ThemeService } from "../../app/theme.service";
import { ResourcesService } from "../../app/resources.service";

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  styleUrls: ['./tool-bar.component.css'],
  templateUrl: './tool-bar.component.html',
  imports: [NgTemplateOutlet]
})
export class ToolBarComponent {
  buttonClassName = computed(() => this._themeService.classNames().button);

  constructor(private _themeService: ThemeService, private _resourcesService: ResourcesService) { }

  newWindowIcon = computed(() => this._resourcesService.resources()?.newWindowIcon?.());
  saveIcon = computed(() => this._resourcesService.resources()?.saveIcon?.());
  undoIcon = computed(() => this._resourcesService.resources()?.undoIcon?.());
  redoIcon = computed(() => this._resourcesService.resources()?.redoIcon?.());
  contentCopyIcon = computed(() => this._resourcesService.resources()?.contentCopyIcon?.());
  contentPasteIcon = computed(() => this._resourcesService.resources()?.contentPasteIcon?.());
  rectangleIcon = computed(() => this._resourcesService.resources()?.rectangleIcon?.());
  circleIcon = computed(() => this._resourcesService.resources()?.circleIcon?.());
  addNotesIcon = computed(() => this._resourcesService.resources()?.addNotesIcon?.());
}
