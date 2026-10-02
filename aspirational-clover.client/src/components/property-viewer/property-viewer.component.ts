import { Component, computed } from '@angular/core';

import { SelectionService } from "../../app/selection.service";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { parseTextBoxContent, updateTextBoxContent } from "../../util/textUtils";
import { Shape } from "../../data/shapes";

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

  hasSelectedRectangle = computed(() => Boolean(this.selectedShape()?.rectangle));

  hasSelectedCircle = computed(() => Boolean(this.selectedShape()?.circle));

  activeDocumentName = computed(() => this._documentService.activeDocument()?.name ?? "");

  onChangeDocumentName = (event: Event) => {
    this._documentService.setActiveDocumentName((event.target as any)?.value ?? "");
  }

  onChangeTextBoxContent = (event: Event, shape: Shape | null | undefined) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    const updatedTextBox = updateTextBoxContent(shape?.textBox, newValue);
    if (shape?.textBox && updatedTextBox) {
      const command = createShapeUpdateCommand(shape, { ...shape, textBox: updatedTextBox });
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeFontSize = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.textBox) {
      const command = createShapeUpdateCommand(shape, { ...shape, textBox: { ...shape.textBox, fontSize: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleWidth = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, width: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleHeight = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, height: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleFillColorFrom = (event: Event, shape: Shape | null | undefined) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, fillColorFrom: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleFillColorTo = (event: Event, shape: Shape | null | undefined) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, fillColorTo: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleFillAngle = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, fillAngle: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleRotationAngle = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, rotationAngle: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleSkewX = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, skewX: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeRectangleSkewY = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, skewY: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleRadius = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, radius: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleFillColorFrom = (event: Event, shape: Shape | null | undefined) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, fillColorFrom: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleFillColorTo = (event: Event, shape: Shape | null | undefined) => {
    const newValue = ((event.target as any)?.value as string) ?? "";
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, fillColorTo: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleFillAngle = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, fillAngle: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleRotationAngle = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, rotationAngle: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleSkewX = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, skewX: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }

  onChangeCircleSkewY = (event: Event, shape: Shape | null | undefined) => {
    const newValue = Number.parseInt(((event.target as any)?.value as string) ?? "0", 10);
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, skewY: newValue }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }
}
