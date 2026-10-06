import { Component, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ThemeService } from "../../app/theme.service";
import { DocumentService } from "../../app/document.service";
import { ResourcesService } from "../../app/resources.service";
import { UndoService } from "../../app/undo.service";
import { Layer } from "../../data/model";
import { createAddLayerCommand } from "../../commands/addLayer";
import { createLayerUpdateCommand } from "../../commands/updateLayer";
import { createDeleteLayerCommand } from "../../commands/deleteLayer";
import { createReorderLayerCommand } from "../../commands/reorderLayer";
import { newUuidV4 } from "../../util/uuid";

@Component({
  selector: 'app-layer-editor',
  standalone: true,
  styleUrls: ['./layer-editor.component.css'],
  templateUrl: './layer-editor.component.html',
  imports: [NgTemplateOutlet],
})
export class LayerEditorComponent {
  layerEditorClass = computed(() => this._themeService.classNames().layerEditor);

  selectedLayerClass = computed(() => this._themeService.classNames().layerEditorSelectedLayer);

  unselectedLayerClass = computed(() => this._themeService.classNames().layerEditorUnselectedLayer);

  buttonClass = computed(() => this._themeService.classNames().button);

  sortedLayers = computed(() => [...(this._documentService.activeDocument()?.layers ?? [])].sort(
    (a, b) => b.zIndex - a.zIndex
  ));

  activeDocument = computed(() => this._documentService.activeDocument());

  selectedLayer = computed(() => this._documentService.selectedLayer());

  selectedLayerClientUuid = computed(() => this.selectedLayer()?.clientUuid);

  visibilityIcon = computed(() => this._resourcesService.resources()?.visibilityIcon());

  visibilityOffIcon = computed(() => this._resourcesService.resources()?.visibilityOffIcon());

  deleteLayerButtonDisasbled = computed(() => (this._documentService.activeDocument()?.layers?.length ?? 0) < 2);

  getVisibilityIcon = (visibilityOff?: boolean | null | undefined) => {
    return visibilityOff ? this.visibilityOffIcon() : this.visibilityIcon();
  }

  constructor(
    private _themeService: ThemeService,
    private _documentService: DocumentService,
    private _undoService: UndoService,
    private _resourcesService: ResourcesService,
  ) {}

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

  onClickVisibility(event: MouseEvent, layer: Layer) {
    event.stopPropagation();
    if (!layer?.clientUuid) return;
    const updatedLayer = { ...layer, hidden: !layer.hidden };
    const command = createLayerUpdateCommand(layer, updatedLayer);
    if (command) {
      this._undoService.applyCommand(command, "forward");
      this._undoService.pushCommand(command);
    }
  }

  onClickLayer(event: MouseEvent, layer: Layer) {
    event.stopPropagation();
    if (!layer?.clientUuid) return;
    const activeDocumentClientUuid = this.activeDocument()?.clientUuid;
    if (!activeDocumentClientUuid) return;
    this._documentService.setSelectedLayer(activeDocumentClientUuid, layer?.clientUuid);
  }

  onClickRaiseLayer(event: MouseEvent, layer: Layer) {
    event.stopPropagation();
  }

  onClickLowerLayer(event: MouseEvent, layer: Layer) {
    event.stopPropagation();
  }

  onClickDeleteLayer(event: MouseEvent, layer: Layer) {
    event.stopPropagation();
    if (this.deleteLayerButtonDisasbled()) return;
    if (!layer.clientUuid) return;
    const command = createDeleteLayerCommand(layer);
    if (!command) return;
    this._undoService.applyCommand(command, "forward");
    this._undoService.pushCommand(command);
  }
}
