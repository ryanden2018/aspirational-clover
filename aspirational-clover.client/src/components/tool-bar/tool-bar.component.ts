import { Component, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ResourcesService } from "../../app/resources.service";
import { ThemeService } from "../../app/theme.service";
import { UndoService } from "../../app/undo.service";
import { ToolTipButtonComponent } from "../tool-tip-button/tool-tip-button.component";

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  styleUrls: ['./tool-bar.component.css'],
  templateUrl: './tool-bar.component.html',
  imports: [NgTemplateOutlet, ToolTipButtonComponent]
})
export class ToolBarComponent {
  isDarkMode = computed(() => this._themeService.mode() === "dark");

  toggleDarkMode() {
    this._themeService.toggleMode();
  }

  constructor(private _themeService: ThemeService, private _resourcesService: ResourcesService, private _undoService: UndoService) { }

  newWindowIcon = computed(() => this._resourcesService.resources()?.newWindowIcon?.());
  fileOpenIcon = computed(() => this._resourcesService.resources()?.fileOpenIcon?.());
  saveIcon = computed(() => this._resourcesService.resources()?.saveIcon?.());
  saveAsIcon = computed(() => this._resourcesService.resources()?.saveAsIcon?.());
  undoIcon = computed(() => this._resourcesService.resources()?.undoIcon?.());
  redoIcon = computed(() => this._resourcesService.resources()?.redoIcon?.());
  contentCopyIcon = computed(() => this._resourcesService.resources()?.contentCopyIcon?.());
  contentPasteIcon = computed(() => this._resourcesService.resources()?.contentPasteIcon?.());
  rectangleIcon = computed(() => this._resourcesService.resources()?.rectangleIcon?.());
  circleIcon = computed(() => this._resourcesService.resources()?.circleIcon?.());
  polylineIcon = computed(() => this._resourcesService.resources()?.polylineIcon?.());
  addNotesIcon = computed(() => this._resourcesService.resources()?.addNotesIcon?.());
  toggleOffIcon = computed(() => this._resourcesService.resources()?.toggleOffIcon?.());
  toggleOnIcon = computed(() => this._resourcesService.resources()?.toggleOnIcon?.());
  toggleDarkModeIcon = computed(() => this.isDarkMode() ? this.toggleOnIcon() : this.toggleOffIcon());

  onClickUndo = () => this._undoService.undo();

  onClickRedo = () => this._undoService.redo();
}
