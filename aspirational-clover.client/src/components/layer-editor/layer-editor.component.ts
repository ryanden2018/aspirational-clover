import { Component, computed } from '@angular/core';

import { ThemeService } from "../../app/theme.service";

@Component({
  selector: 'app-layer-editor',
  standalone: true,
  styleUrls: ['./layer-editor.component.css'],
  templateUrl: './layer-editor.component.html',
})
export class LayerEditorComponent {
  layerEditorClass = computed(() => this._themeService.classNames().layerEditor);

  buttonClass = computed(() => this._themeService.classNames().button);

  constructor(private _themeService: ThemeService) {}
}
