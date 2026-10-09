import { Component, input, computed } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { ThemeService } from "../../app/theme.service";
import { ResourcesService } from "../../app/resources.service";
import { ToastSignal } from "../../types";

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [NgTemplateOutlet],
})
export class ToastComponent {
  toast = input<ToastSignal>(null);

  close = input<(() => void) | null>(null);

  buttonClassName = computed(() => this._themeService.classNames().button);

  closeIcon = computed(() => this._resourcesService.resources()?.closeIcon?.());

  toastClassName = computed(() => {
    switch (this.toast()?.type) {
      case "success":
        return "toast toast-success";
      case "error":
        return "toast toast-error";
      case "warning":
        return "toast toast-warning";
      default:
        return "toast";
    }
  });

  constructor (private _themeService: ThemeService, private _resourcesService: ResourcesService) {}
}
