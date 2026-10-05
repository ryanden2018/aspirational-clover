import { Component, computed } from '@angular/core';

import { ThemeService } from "../../app/theme.service";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { createAddLayerCommand } from "../../commands/addLayer";
import { newUuidV4 } from "../../util/uuid";

@Component({
  selector: 'app-layer-editor',
  standalone: true,
  styleUrls: ['./layer-editor.component.css'],
  templateUrl: './layer-editor.component.html',
})
export class LayerEditorComponent {
  layerEditorClass = computed(() => this._themeService.classNames().layerEditor);

  buttonClass = computed(() => this._themeService.classNames().button);

  sortedLayers = computed(() => [...(this._documentService.activeDocument()?.layers ?? [])].sort(
    (a, b) => a.zIndex - b.zIndex
  ));

  activeDocument = computed(() => this._documentService.activeDocument());

  constructor(private _themeService: ThemeService, private _documentService: DocumentService, private _undoService: UndoService) {}

  onClickAddLayer() {
    const activeDocument = this.activeDocument();
    if (!activeDocument) return;
    const currentLayers = this.sortedLayers();
    const layerCount = currentLayers.length;
    const maxZIndex = Math.max(0, ...(currentLayers.map(layer => layer.zIndex)));
    const command = createAddLayerCommand({
      id: 0,
      documentId: activeDocument.id,
      clientUuid: newUuidV4(),
      name: `Layer ${layerCount + 1}`,
      hidden: false,
      zIndex: maxZIndex + 1,
      shapes: [],
    });

    if (command) {
      this._undoService.applyCommand(command, "forward");
      this._undoService.pushCommand(command);
    }
  }
}
