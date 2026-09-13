import { Component, computed, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ThemeService } from "../../app/theme.service";
import { ResourcesComponent } from "../resources/resources.component";

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  styleUrls: ['./tool-bar.component.css'],
  templateUrl: './tool-bar.component.html',
  imports: [NgTemplateOutlet, ResourcesComponent]
})
export class ToolBarComponent {
  buttonClassName = computed(() => this._themeService.classNames().button);
  resources = viewChild<ResourcesComponent>(ResourcesComponent);
  saveIcon = computed(() => this.resources()?.saveIcon?.());
  newWindowIcon = computed(() => this.resources()?.newWindowIcon?.());

  constructor(private _themeService: ThemeService) {}
}
