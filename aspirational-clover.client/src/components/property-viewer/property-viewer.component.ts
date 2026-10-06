import { Component, computed } from '@angular/core';

import { SelectionService } from "../../app/selection.service";
import { DocumentService } from "../../app/document.service";
import { UndoService } from "../../app/undo.service";
import { ThemeService } from "../../app/theme.service";
import { createShapeUpdateCommand } from "../../commands/updateShape";
import { parseTextBoxContent, updateTextBoxContent } from "../../util/textUtils";
import { Shape } from "../../data/shapes";
import { createUpdateDocumentCommand } from '../../commands/updateDocument';
import { createLayerUpdateCommand } from "../../commands/updateLayer";
import { LayerEditorComponent } from "../layer-editor/layer-editor.component";

@Component({
  selector: 'app-property-viewer',
  standalone: true,
  styleUrls: ['./property-viewer.component.css'],
  templateUrl: './property-viewer.component.html',
  imports: [LayerEditorComponent]
})
export class PropertyViewerComponent {
  constructor(
    private _selectionService: SelectionService,
    private _documentService: DocumentService,
    private _undoService: UndoService,
    private _themeService: ThemeService,
  ) {}

  buttonClass = computed(() => this._themeService.classNames().button);

  selectedShape = computed(() => this._selectionService.selectedShape());

  hasSelectedShape = computed(() => Boolean(this.selectedShape()));

  hasSelectedTextBox = computed(() => Boolean(this.selectedShape()?.textBox));

  textBoxContent = computed(() => parseTextBoxContent(this.selectedShape()?.textBox));

  hasSelectedRectangle = computed(() => Boolean(this.selectedShape()?.rectangle));

  hasSelectedCircle = computed(() => Boolean(this.selectedShape()?.circle));

  activeDocumentName = computed(() => this._documentService.activeDocument()?.name ?? "");

  selectedLayer = computed(() => this._documentService.selectedLayer());

  onChangeDocumentName = (event: Event) => {
    const document = this._documentService.activeDocument();
    if (!document) return;
    const newDocument = { ...document, name: (event.target as any)?.value ?? "" };
    const command = createUpdateDocumentCommand(document, newDocument);
    this._undoService.applyCommand(command, "forward");
    this._undoService.pushCommand(command);
  }

  onChangeLayerName = (event: Event) => {
    const layer = this._documentService.selectedLayer();
    if (!layer) return;
    const updatedLayer = { ...layer, name: (event.target as any)?.value ?? "" };
    const command = createLayerUpdateCommand(layer, updatedLayer);
    if (!command) return;
    this._undoService.applyCommand(command, "forward");
    this._undoService.pushCommand(command);
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

  onClickRemoveGradientRectangle(shape: Shape | null | undefined) {
    if (shape?.rectangle) {
      const command = createShapeUpdateCommand(shape, { ...shape, rectangle: { ...shape.rectangle, fillColorTo: "" }});
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

  onClickRemoveGradientCircle(shape: Shape | null | undefined) {
    if (shape?.circle) {
      const command = createShapeUpdateCommand(shape, { ...shape, circle: { ...shape.circle, fillColorTo: "" }});
      if (command) {
        this._undoService.applyCommand(command, "forward");
        this._undoService.pushCommand(command);
      }
    }
  }
}
