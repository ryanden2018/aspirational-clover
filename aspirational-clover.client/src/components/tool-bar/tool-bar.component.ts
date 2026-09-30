import { Component, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ResourcesService } from "../../app/resources.service";
import { ThemeService } from "../../app/theme.service";
import { UndoService } from "../../app/undo.service";
import { DocumentService } from "../../app/document.service";
import { ShapeToolsService } from "../../app/shape-tools.service";
import { SelectionService } from "../../app/selection.service";
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

  constructor(
    private _themeService: ThemeService,
    private _resourcesService: ResourcesService,
    private _undoService: UndoService,
    private _shapeToolsService: ShapeToolsService,
    private _documentService: DocumentService,
    private _selectionService: SelectionService,
  ) { }

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
  githubIcon = computed(() => this._resourcesService.resources()?.githubIcon?.());

  onClickUndo = () => this._undoService.undo();

  onClickRedo = () => this._undoService.redo();

  onClickCircle = () => this._shapeToolsService.setMode("circle");

  onClickRectangle = () => this._shapeToolsService.setMode("rectangle");

  onClickPolyline = () => this._shapeToolsService.setMode("polyline");

  onClickTextBox = () => this._shapeToolsService.setMode("textbox");

  onClickNew = () => this._documentService.newDocument();

  onClickCopy = () => this._selectionService.copySelectedShapeToClipboard();

  onClickPaste = () => this._selectionService.pasteShapeFromClipboard();
}
