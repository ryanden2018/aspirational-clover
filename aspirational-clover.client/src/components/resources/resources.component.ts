import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: "app-resources",
  standalone: true,
  templateUrl: "./resources.component.html",
})
export class ResourcesComponent {
  newWindowIcon = viewChild<TemplateRef<unknown>>("newWindowIcon");
  saveIcon = viewChild<TemplateRef<unknown>>("saveIcon");
  undoIcon = viewChild<TemplateRef<unknown>>("undoIcon");
  redoIcon = viewChild<TemplateRef<unknown>>("redoIcon");
  contentCopyIcon = viewChild<TemplateRef<unknown>>("contentCopyIcon");
  contentPasteIcon = viewChild<TemplateRef<unknown>>("contentPasteIcon");
  rectangleIcon = viewChild<TemplateRef<unknown>>("rectangleIcon");
  circleIcon = viewChild<TemplateRef<unknown>>("circleIcon");
  addNotesIcon = viewChild<TemplateRef<unknown>>("addNotesIcon");
}
