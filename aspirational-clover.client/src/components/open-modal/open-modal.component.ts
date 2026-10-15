import { Component, computed, signal } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { DocumentService } from '../../app/document.service';
import { ResourcesService } from "../../app/resources.service";
import { ThemeService } from "../../app/theme.service";

@Component({
  selector: 'app-open-modal',
  standalone: true,
  templateUrl: './open-modal.component.html',
  styleUrls: ['./open-modal.component.css'],
  imports: [
    NgTemplateOutlet,
  ]
})
export class OpenModalComponent {
  openModalOpen = computed(() => this._documentService.openModalOpen());

  openModalUrl = signal<string>("");

  buttonClassName = computed(() => this._themeService.classNames().button);
  
  openModalClassName = computed(() => this._themeService.classNames().openModal);
  
  closeIcon = computed(() => this._resourcesService.resources()?.closeIcon?.());

  constructor(private _documentService: DocumentService, private _themeService: ThemeService, private _resourcesService: ResourcesService) {}

  onClickOpen(event: MouseEvent) {
    event.stopPropagation();
    this._documentService.closeOpenModal();
    this._documentService.openDocumentByUrl(this.openModalUrl());
  }

  onClickCancel(event: MouseEvent) {
    event.stopPropagation();
    this.openModalUrl.set("");
    this._documentService.closeOpenModal();
  }

  onInputUrl(event: Event) {
    const value = ((event.target as HTMLInputElement).value as string) ?? "";
    this.openModalUrl.set(value);
  }
}
