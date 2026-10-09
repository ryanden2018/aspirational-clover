import { Component, computed } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { DocumentService } from '../../app/document.service';
import { ResourcesService } from "../../app/resources.service";
import { UndoService } from "../../app/undo.service";
import { ThemeService } from "../../app/theme.service";

@Component({
  selector: 'app-save-modal',
  standalone: true,
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.css'],
  imports: [
    NgTemplateOutlet,
  ]
})
export class SaveModalComponent {
  saveModalOpen = computed(() => this._documentService.saveModalOpen());

  buttonClassName = computed(() => this._themeService.classNames().button);
  
  saveModalClassName = computed(() => this._themeService.classNames().saveModal);
  
  closeIcon = computed(() => this._resourcesService.resources()?.closeIcon?.());

  constructor(private _documentService: DocumentService, private _themeService: ThemeService, private _resourcesService: ResourcesService, private _undoService: UndoService) {}

  onClickSave(event: MouseEvent) {
    event.stopPropagation();
    this._documentService.closeSaveModal();
    this._documentService.saveDocument(() => this._undoService.clearStack());
  }

  onClickCancel(event: MouseEvent) {
    event.stopPropagation();
    this._documentService.closeSaveModal();
  }
}
