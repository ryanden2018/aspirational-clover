import { Component, computed } from '@angular/core';

import { SelectionService } from "../../app/selection.service";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { parseTextBoxContent } from "../../util/textUtils";

@Component({
  selector: 'app-property-viewer',
  standalone: true,
  styleUrls: ['./property-viewer.component.css'],
  templateUrl: './property-viewer.component.html',
  imports: []
})
export class PropertyViewerComponent {
  constructor(
    private _selectionService: SelectionService,
    private _documentService: DocumentService,
    private _undoService: UndoService,
  ) {}

  selectedShape = computed(() => this._selectionService.selectedShape());

  hasSelectedShape = computed(() => Boolean(this.selectedShape()));

  hasSelectedTextBox = computed(() => Boolean(this.selectedShape()?.textBox));

  textBoxContent = computed(() => parseTextBoxContent(this.selectedShape()?.textBox));

  activeDocumentName = computed(() => this._documentService.activeDocument()?.name ?? "");

  onChangeDocumentName = (event: Event) => {
    this._documentService.setActiveDocumentName((event.target as any)?.value ?? "");
  }

  onChangeTextBoxContent = (event: Event) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    const shape = this.selectedShape();
    if (shape?.textBox?.content) {
      const command = createShapeUpdateCommand(shape, { ...shape, textBox: { ...shape.textBox, content: JSON.stringify({ text: newValue }) }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }
}
