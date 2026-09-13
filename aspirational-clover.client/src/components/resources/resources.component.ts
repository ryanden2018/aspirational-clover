import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: "app-resources",
  standalone: true,
  templateUrl: "./resources.component.html",
})
export class ResourcesComponent {
  newWindowIcon = viewChild<TemplateRef<unknown>>("newWindowIcon");
  saveIcon = viewChild<TemplateRef<unknown>>("saveIcon");
}
