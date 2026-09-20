import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: "app-resources",
  standalone: true,
  templateUrl: "./resources.component.html",
})
export class ResourcesComponent {
  newWindowIcon = viewChild<TemplateRef<unknown>>("newWindowIcon");
  fileOpenIcon = viewChild<TemplateRef<unknown>>("fileOpenIcon");
  saveIcon = viewChild<TemplateRef<unknown>>("saveIcon");
  saveAsIcon = viewChild<TemplateRef<unknown>>("saveAsIcon");
  undoIcon = viewChild<TemplateRef<unknown>>("undoIcon");
  redoIcon = viewChild<TemplateRef<unknown>>("redoIcon");
  contentCopyIcon = viewChild<TemplateRef<unknown>>("contentCopyIcon");
  contentPasteIcon = viewChild<TemplateRef<unknown>>("contentPasteIcon");
  rectangleIcon = viewChild<TemplateRef<unknown>>("rectangleIcon");
  circleIcon = viewChild<TemplateRef<unknown>>("circleIcon");
  polylineIcon = viewChild<TemplateRef<unknown>>("polylineIcon");
  addNotesIcon = viewChild<TemplateRef<unknown>>("addNotesIcon");
  toggleOffIcon = viewChild<TemplateRef<unknown>>("toggleOffIcon");
  toggleOnIcon = viewChild<TemplateRef<unknown>>("toggleOnIcon");
}
